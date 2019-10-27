const mongoose = require('mongoose');
const asyncHandler = require('../utils/async-handler');

const ErrorResponse = require('../utils/error-response');
const Mail = require('../models/mail');

const generateFilename = require('../utils/generate-filename');
const crypto = require('../utils/encrypt');

const s3Service = require('../services/s3');
const mailService = require('../services/mail');
const emailService = require('../services/email');
const userService = require('../services/user');
const addressService = require('../services/address');
const subscriptionService = require('../services/subscription');
const invoiceService = require('../services/invoice');

/* 
  @desc     Get mails - associated with the sign-in account
  @route    [GET] /api/v1/mails
  @access   Private
*/

exports.getMails = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection, sort, skip, limit
  const { filter, sort, skip, limit } = req.queryData;
  if (userRole !== 'ADMIN') {
    delete filter.senderId;
    delete filter.receiverId;
  }

  // $1: mail count
  const count = await Mail.find(filter)
    .byUser(userId, userRole) // this will overwrite senderId, reciverId even if query passed through
    .countDocuments();

  // $2: mail array
  const mails = await Mail.find(filter)
    .byUser(userId, userRole)
    .sort(sort)
    .skip(skip)
    .limit(Math.min(limit, count)) // cap limit with mail count
    .lean();

  // success response
  res.status(200).json({ ok: true, data: { mails, count } });
});

/* 
  @desc     Get single mail by id
  @route    [GET] /api/v1/mails/:id
  @access   Private
*/

exports.getMail = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection
  const filter = { _id: req.params.id };

  // $1: mail
  const mail = await Mail.findOne(filter)
    .byUser(userId, userRole)
    .lean();
  if (!mail) return next(new ErrorResponse('Cannot find the mail', 400));

  // success response
  res.status(200).json({ ok: true, data: { mail } });
});

/* 
  @desc     Update mails - only allow flags OR status entries
  @route    [PATCH] /api/v1/mails
  @access   Private
*/

exports.updateMails = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, options, update
  const { _id: filter } = req.queryData.filter;
  const options = { runValidators: true };
  const update = mailService.generateMailUpdate(req.body);

  // validation
  if (!filter._id) return next(new ErrorResponse('Invalid request', 400));

  // $1: update mails
  result = await Mail.updateMany(filter, update, options).byUser(userId, userRole);
  if (!result || result.n === 0) {
    next(new ErrorResponse('No mail is updated', 400));
  }

  // success response
  res.status(200).json({ ok: true, result: { n: result.n, nModified: result.nModified } });
});

/* 
  @desc     Update mail by id - only allow flags OR status entries
  @route    [PATCH] /api/v1/mails/:id
  @access   Private
*/

exports.updateMail = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, options, update
  const filter = { _id: req.params.id };
  const options = { runValidators: true };
  const update = mailService.generateMailUpdate(req.body);

  // $1: update mail
  const result = await Mail.updateOne(filter, update, options).byUser(userId, userRole);
  if (!result || result.n === 0) {
    return next(new ErrorResponse('No mail is updated', 400));
  }

  // success response
  res.status(200).json({ ok: true, result: { n: result.n, nModified: result.nModified } });
});

/* 
  @desc     Delete mails
  @route    [DEL] /api/v1/mails
  @access   Private
*/

exports.deleteMails = asyncHandler(async (req, res, next) => {
  // query by user status
  const userRole = req.userData.role;
  const userId = req.userData.userId;

  // filter
  const { _id: filter } = req.queryData.filter;

  // validation
  if (!filter._id) return next(new ErrorResponse('Invalid request', 400));

  // $1: delete mails
  const result = await Mail.deleteMany(filter).byUser(userId, userRole);
  if (!result || result.deletedCount === 0) {
    return next(new ErrorResponse('No mail is deleted', 400));
  }

  // success response
  res.status(200).json({ ok: true, result: { n: result.n, deletedCount: result.deletedCount } });
});

/* 
  @desc     Delete mail by id
  @route    [DEL] /api/v1/mails/:id
  @access   Private
*/

exports.deleteMail = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter
  const filter = { _id: req.params.id };

  // $1: delete mails
  const result = await Mail.deleteOne(filter).byUser(userId, userRole);
  if (!result || result.deletedCount === 0) {
    return next(ErrorResponse(`Unable to delete mail ${req.params.id}`, 400));
  }

  // success response
  res.status(200).json({ ok: true, result: { n: result.n, deletedCount: result.deletedCount } });
});

/* 
  @desc     Get mail envelop image file
  @route    [GET] /api/v1/mails/:id/envelop
  @access   Private
*/

exports.getEnvelop = async (req, res) => {
  try {
    // query by user status
    const userId = req.userData.userId;
    const userRole = req.userData.role;

    // filter
    const filter = { _id: req.params.id };

    // $1: find mail
    const mail = await Mail.findOne(filter)
      .select('+envelopKey')
      .byUser(userId, userRole);
    if (!mail) {
      return next(new ErrorResponse('Mail not found', 404));
    } else if (!mail.envelopKey) {
      return next(new ErrorResponse('Mail envelop not found', 404));
    }

    // s3 file read stream
    const key = crypto.decrypt(mail.envelopKey);
    const params = { Bucket: process.env.AWS_BUCKET, Key: key };
    var stream = s3Service.s3.getObject(params).createReadStream();

    // event listeners
    stream.on('error', () => stream.end()); // mannually closes the stream TODO: stream.unpipe(res)
    req.on('close', () => stream.end()); // ensure cancelled request also closes stream

    // response header
    const ext = key.split('.').slice(-1)[0];
    res.setHeader('Content-Type', 'image/' + ext);

    // stream response
    stream.pipe(res);
  } catch (error) {
    if (stream) stream.end();
    next(error);
  }
};

/* 
  @desc     Get mail content pdf file 
  @route    [GET] /api/v1/mails/:id/contentPDF
  @access   Private
*/

exports.getContentPDF = async (req, res) => {
  try {
    // query by user status
    const userId = req.userData.userId;
    const userRole = req.userData.role;

    // filter, update
    const filter = { _id: req.params.id };
    const update = { $set: { 'flags.read': true } };

    // $1: find mail
    const mail = await Mail.findOneAndUpdate(filter, update)
      .select('+contentPDFKey')
      .byUser(userId, userRole);
    if (!mail) {
      return next(new ErrorResponse('Mail not found', 404));
    } else if (!mail.contentPDFKey) {
      return next(new ErrorResponse('Mail content pdf not found', 404));
    }

    // s3 file read stream
    const key = crypto.decrypt(mail.contentPDFKey);
    const params = { Bucket: process.env.AWS_BUCKET, Key: key };
    var stream = s3Service.s3.getObject(params).createReadStream();

    // event listeners
    stream.on('error', () => stream.end()); // mannually closes the stream TODO: stream.unpipe(res)
    req.on('close', () => stream.end()); // ensure cancelled request also closes stream

    // response header
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + 'Mail Content' + '"');

    // stream response
    stream.pipe(res);
  } catch (error) {
    if (stream) stream.end();
    next(error);
  }
};

/* 
  @desc     Create mail 
  @route    [POST] /api/v1/mails/
  @access   Private/Sender
  FIXME: this is an awfully fat controller
*/

exports.createMail = asyncHandler(async (req, res, next) => {
  // check uploaded envelop
  if (req.fileTypeError) {
    return next(
      new ErrorResponse('Invalid envelop image filetype (allowed type: jpg, jpeg, png)', 400)
    );
  }

  // senderId, receiverId
  const senderId = req.userData.userId;
  const { receiverId } = req.body;

  // validation service calls
  const receiverPromise = userService.findUserById(receiverId);
  const addressPromise = addressService.findAddressBySenderReceiverIds(senderId, receiverId);
  const subscriptionsPromise = subscriptionService.findActiveSubscriptionsByUserId(receiverId);

  // $1: resolve validation promises
  const promises = [receiverPromise, addressPromise, subscriptionsPromise];
  const [receiver, address, subscriptions] = await Promise.all(promises);

  // receiver-sender validation
  if (!address) {
    return next(new ErrorResponse('Invalid request', 401));
  }

  // active subscription validation at the address
  const subscription = subscriptions.find(
    subscription => subscription.addressId.toString() === address._id.toString()
  );
  if (!subscription) {
    return next(new ErrorResponse('Receiver does not have active subscription', 400));
  }

  // generate mail id
  const mailId = new mongoose.mongo.ObjectId();

  // $2: upload file to s3
  const file = req.files.envelop[0];
  const filename = generateFilename(file, receiverId, mailId.toString());
  await s3Service.uploadFile(file, filename);

  // $3: create mail
  const mail = await new Mail({
    _id: mailId,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    senderId,
    receiverId,
    envelopKey: crypto.encrypt(filename)
  }).save();

  // $4: create usage record
  await invoiceService.createMailUsageRecord(mail, subscription);

  // $4: send email
  await emailService.mailReceivedNotification(receiver, mail, file);

  // success response
  res.status(201).json({ ok: true, data: { mail } });
});

/* 
  @desc     Update mail - mail text content, envelop image, upload content pdf
  @route    [Put] /api/v1/mails/:id
  @access   Private/Sender
  FIXME: this is an awfully fat controller
*/

exports.modifyMail = asyncHandler(async (req, res, next) => {
  // check uploaded envelop
  if (req.fileTypeError)
    return res.status(401).json('Invalid envelop image filetype (allowed type: jpg, jpeg, png)');

  // validation
  const [id, senderId] = [req.params.id, req.userData.userId];
  const mail = await Mail.findById(id);

  // valid id
  if (!mail) {
    return next(new ErrorResponse('Unknow resource', 404));
  }

  // validate belongs to sender
  if (mail.senderId.toString() !== senderId) {
    return next(new ErrorResponse('Invalid request', 400));
  }

  // validate status
  if (mail.flags.terminated) {
    return next(
      new ErrorResponse(`Mail is already in ${mail.status}, and cannot be modified`, 400)
    );
  } else if (mail.status !== 'SCANNING' && req.files.contentPDF) {
    return next(
      new ErrorResponse(`Mail is in ${mail.status} state, content pdf cannot be uploaded`, 400)
    );
  }

  // $1: upload files to s3
  const envelopFile = req.files.envelop ? req.files.envelop[0] : undefined;
  const contentFile = req.files.contentPDF ? req.files.contentPDF[0] : undefined;

  if (envelopFile) {
    const filename = generateFilename(envelopFile, mail);
    var envelopKey = crypto.encrypt(filename);
    await s3Service.uploadFile(envelopFile, filename);
  }

  if (contentFile) {
    const filename = generateFilename(contentFile, mail);
    var contentKey = crypto.encrypt(filename);
    await s3Service.uploadFile(contentFile, filename);
  }

  // $2: update mail
  const { title, description, content } = req.body;
  const result = await mailService.putUpdateMail(
    id,
    title,
    description,
    content,
    envelopKey,
    contentKey
  );

  if (!result || result.n === 0) {
    return next(new ErrorResponse(`Unable to put update mail ${id}`, 400));
  }

  // $3: create charge & send email
  if (contentFile) {
    // receiver and subscription
    const receiverPromise = userService.findUserById(mail.receiverId);
    const addressPromise = addressService.findAddressBySenderReceiverIds(senderId, mail.receiverId);
    const subscriptionsPromise = subscriptionService.findActiveSubscriptionsByUserId(
      mail.receiverId
    );
    const promises = [receiverPromise, addressPromise, subscriptionsPromise];

    // resolve all promises
    const [receiver, address, subscriptions] = await Promise.all(promises);
    const subscription = subscriptions.find(
      subscription => subscription.addressId.toString() === address._id.toString()
    );

    // create scan usage record & email scanned notification
    await invoiceService.createScanUsageRecord(mail, subscription);
    await emailService.mailScannedNotification(receiver, contentFile);
  }

  // success response
  res.status(200).json({ ok: true, result: { n: result.n, nModified: result.nModified } });
});
