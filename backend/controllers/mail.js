const mongoose = require('mongoose');

const Mail = require('../models/mail');
const Address = require('../models/address');

const generateFilename = require('../utils/generate-filename');
const crypto = require('../utils/encrypt');

const S3Service = require('../services/s3');
const EmailService = require('../services/email');
const InvoiceService = require('../services/invoice');

/*
  Function: get mail list [GET]
*/

exports.getMailList = async (req, res) => {
  console.log('getMailList is called');
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;
    // sender can query his/her receivers' mails
    const receiverId = req.query.receiverId ? { receiverId: req.query.receiverId } : {};

    // filter, projection, sort, skip, limit
    const filter = { ...req.queryData.filterBy, ...receiverId };
    const projection = { envelopKey: 0, contentPDFKey: 0 };
    const sort = req.queryData.sortBy;
    const skip = req.queryData.skip;
    const limit = req.queryData.limit;

    // $1: mail count
    const mailCount = await Mail.find(filter, projection)
      .byUser(userId, isSender)
      .countDocuments();

    // $2: mail array
    const mails = await Mail.find(filter, projection)
      .byUser(userId, isSender)
      .sort(sort.sort)
      .skip(skip)
      .limit(Math.min(limit, mailCount)) // cap limit with mailCount
      .lean();

    // success response
    res.status(200).json({
      message: 'Mails fetched successfully.',
      mailList: mails,
      mailCount: mailCount
    });
  } catch {
    // error response
    res.status(500).json({
      message: 'Failed to fetch mails!'
    });
  }
};

/*
  Function: fetch single mail by id [GET]
*/

exports.getMail = async (req, res) => {
  console.log('getMail is called');
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, projection
    const filter = { _id: req.params.id };
    const projection = { envelopKey: 0, contentPDFKey: 0 };

    // $1: mail
    const mail = await Mail.findOne(filter, projection)
      .byUser(userId, isSender)
      .lean();
    if (!mail) return res.status(400).json({ message: 'Cannot find the mail' });

    // success response
    res.status(200).json({
      message: 'Mail fetched successfully',
      mail: mail
    });
  } catch {
    // error response
    res.status(500).json({
      message: 'Failed to fetch mail'
    });
  }
};

/*
  Function: update flags OR status associated with mails [PATCH]
*/

exports.updateMails = async (req, res) => {
  console.log('updateMails is called');
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, options
    const filter = { _id: { $in: req.queryData.ids } };
    const options = { fields: { envelopKey: 0, contentPDFKey: 0 }, runValidators: true };

    // update
    const isTerminated = req.body.status === 'COLLECTED' || req.body.status === 'TRASHED';
    const update = {
      'flags.read': typeof req.body.flags !== 'undefined' ? req.body.flags.read : undefined,
      'flags.star': typeof req.body.flags !== 'undefined' ? req.body.flags.star : undefined,
      'flags.issue': req.body.status === 'RE_SCANNING' ? true : undefined, // only triggered by issue re-scanning
      'flags.terminated': isTerminated ? true : undefined, // only triggered by collected || trashed
      status: typeof req.body.status !== 'undefined' ? req.body.status : undefined
    };
    Object.keys(update).forEach(key => (update[key] === undefined ? delete update[key] : ''));

    // $1: update mails
    result = await Mail.updateMany(filter, { $set: update }, options).byUser(userId, isSender);
    if (result.n === 0) {
      console.log('no mail is updated by the patch request');
    }

    // success response
    res.status(201).json({
      message: 'Mails flag(s) or status patched successfully',
      mail: result
    });
  } catch {
    // error response
    return res.status(500).json({
      message: 'Failed to patch mail update'
    });
  }
};

/*
  Function: update flags OR status associated with the mail [PATCH]
*/

exports.updateMail = async (req, res) => {
  console.log('updateMail is called');
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, options
    const filter = { _id: req.params.id };
    const options = { fields: { envelopKey: 0, contentPDFKey: 0 }, runValidators: true };

    // update
    const isTerminated = req.body.status === 'COLLECTED' || req.body.status === 'TRASHED';
    const update = {
      'flags.read': typeof req.body.flags !== 'undefined' ? req.body.flags.read : undefined,
      'flags.star': typeof req.body.flags !== 'undefined' ? req.body.flags.star : undefined,
      'flags.issue': req.body.status === 'RE_SCANNING' ? true : undefined, // only triggered by issue re-scanning
      'flags.terminated': isTerminated ? true : undefined, // only triggered by collected || trashed
      status: typeof req.body.status !== 'undefined' ? req.body.status : undefined
    };
    Object.keys(update).forEach(key => (update[key] === undefined ? delete update[key] : ''));

    // $1: update mail
    result = await Mail.updateOne(filter, { $set: update }, options).byUser(userId, isSender);
    if (result.n === 0) {
      console.log('no mail is updated by the patch request');
    }

    // success response
    res.status(201).json({
      message: 'Mail flag(s) or status patched successfully',
      mail: result
    });
  } catch {
    // error response
    return res.status(500).json({
      message: 'Failed to patch mail update'
    });
  }
};

/*
  Function: delete mails [DEL]
*/

exports.deleteMails = async (req, res) => {
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, projection
    const filter = { _id: { $in: req.queryData.ids } };
    const projection = { envelopKey: 0, contentPDFKey: 0 };

    // $1: delete mails
    const result = await Mail.deleteMany(filter, projection).byUser(userId, isSender);
    if (result.deletedCount === 0) {
      console.log('no mail is deleted by the del request');
    }

    // success response
    res.status(201).json({
      message: 'Mails deleted successfully.'
    });
  } catch {
    // error response
    return res.status(500).json({
      message: 'Failed to delete mails'
    });
  }
};

/*
  Function: delete a mail [DEL]
*/

exports.deleteMail = async (req, res) => {
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, projection
    const filter = { _id: req.params.id };
    const projection = { envelopKey: 0, contentPDFKey: 0 };

    // $1: delete mails
    const result = await Mail.deleteOne(filter, projection).byUser(userId, isSender);
    if (result.deletedCount === 0) {
      console.log('no mail is deleted by the del request');
    }

    // success response
    res.status(201).json({
      message: 'Mail deleted successfully.'
    });
  } catch {
    // error response
    return res.status(500).json({
      message: 'Failed to delete mail'
    });
  }
};

/*
  Function: get envelop image of one mail [GET]
*/

exports.getEnvelop = async (req, res) => {
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter
    const filter = { _id: req.params.id };

    // $1: find mail
    const mail = await Mail.findOne(filter).byUser(userId, isSender);
    if (!mail) {
      return res.status(400).json({ message: 'Cannot find mail' });
    } else if (!mail.envelopKey) {
      return res.status(400).json({ message: 'Cannot find mail envelop' });
    }

    // s3 params
    const key = crypto.decrypt(mail.envelopKey);
    const params = { Bucket: process.env.AWS_BUCKET, Key: key };
    const ext = key.split('.').slice(-1)[0];

    // $2: stream envelop image from s3
    var stream = S3Service.s3.getObject(params).createReadStream();
    stream.on('error', () => stream.end()); // mannually closes the stream TODO: stream.unpipe(res)
    req.on('close', () => stream.end()); // ensure cancelled request also closes stream

    // stream response
    res.setHeader('Content-Type', 'image/' + ext);
    stream.pipe(res);
  } catch {
    // error response
    if (stream) stream.end();
    return res.status(500).json({
      message: 'Failed to get envelop'
    });
  }
};

/*
  Function: get one mail's content PDF [GET]
*/

exports.getContentPDF = async (req, res) => {
  console.log('getContentPDF is called');
  try {
    // query by user status
    const isSender = req.userData.isSender;
    const userId = req.userData.userId;

    // filter, update
    const filter = { _id: req.params.id };
    const update = { $set: { 'flags.read': true } };

    // $1: find mail
    const mail = await Mail.findOneAndUpdate(filter, update).byUser(userId, isSender);
    if (!mail) {
      return res.status(400).json({ message: 'Cannot find mail' });
    } else if (!mail.contentPDFKey) {
      return res.status(400).json({ message: 'Cannot find mail content pdf' });
    }

    // s3 params
    const key = crypto.decrypt(mail.contentPDFKey);
    const params = { Bucket: process.env.AWS_BUCKET, Key: key };

    // $2: stream content pdf from s3
    var stream = S3Service.s3.getObject(params).createReadStream();
    stream.on('error', () => stream.end()); // mannually closes the stream TODO: stream.unpipe(res)
    req.on('close', () => stream.end()); // ensure cancelled request also closes stream

    // stream response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + 'Mail Content' + '"');
    stream.pipe(res);
  } catch {
    // error response
    if (stream) stream.end();
    return res.status(500).json({
      message: 'Failed to get contend pdf'
    });
  }
};

/*
  Function: send a new mail [POST]
*/

exports.createMail = async (req, res, next) => {
  // check uploaded envelop
  if (req.fileTypeError)
    return res.status(401).json('Invalid envelop image filetype (allowed type: jpg, jpeg, png)');
  if (typeof req.body.receiverId === 'undefined')
    return res.status(401).json('Please specify receiver');

  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // envelop file
    const file = req.files.envelop[0]; // try catch throw Error('Please include envelop info')

    // filter, options, populate options
    const filter = { senderId: req.userData.userId, 'receivers.receiverId': req.body.receiverId };
    const options = { session: session, runValidators: true };
    const receiverId = mongoose.Types.ObjectId(req.body.receiverId);
    const optionsPop = {
      path: 'receivers.receiverId',
      match: { _id: receiverId },
      select: ' name email'
    };

    // $1: check receiver belongs to sender
    const address = await Address.findOne(filter, {}, options).populate(optionsPop);
    if (!address) throw Error;

    // $2: create mail
    const mail_ = new Mail({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      senderId: mongoose.Types.ObjectId(req.userData.userId),
      receiverId: mongoose.Types.ObjectId(receiverId),
      status: 'CREATED'
    });
    const mail = await mail_.save(options);

    // $3: s3 file upload
    const filename = generateFilename(file, mail);
    await S3Service.uploadFile(file, filename);

    // $4: update mail envelop field
    const filterUpdate = { _id: mail._id };
    const update = { envelopKey: crypto.encrypt(filename) };
    await Mail.updateOne(filterUpdate, update, options);

    // $5: send email
    const receiver = address.receivers[0].receiverId;
    await EmailService.mailReceivedNotification(receiver, mail, file);

    // complete transaction and closes session
    await session.commitTransaction();
    session.endSession();

    // $7: invoice and stripe
    let succeeded = false;
    for (let i = 0; i < 3 && !succeeded; i++) {
      try {
        await InvoiceService.newMail(receiver._id, mail._id);
        succeeded = true;
      } catch (error) {
        console.error(error);
      }
    }

    // success response
    res.status(201).json({
      message: 'Mail sent successfully',
      mail: mail
    });
  } catch (err) {
    console.log(err);

    // closes transaction and session
    await session.abortTransaction();
    session.endSession();

    // error response
    res.status(500).json({
      message: 'Failed to create new mail'
    });
  }
};

/*
  Function: modify a mail (change mail text content, envelop image, upload content pdf) [PUT]
*/

exports.modifyMail = async (req, res) => {
  // check uploaded envelop
  if (req.fileTypeError)
    return res.status(401).json('Invalid envelop image filetype (allowed type: jpg, jpeg, png)');

  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // envelop and pdffile
    const envelopFile = req.files.envelop ? req.files.envelop[0] : undefined;
    const contentFile = req.files.contentPDF ? req.files.contentPDF[0] : undefined;

    // filter, options
    const filter = {
      _id: req.params.id,
      senderId: req.userData.userId,
      'flags.terminated': false
    };
    const options = { session: session, runValidators: true };
    const optionsPop = { path: 'receiverId', select: ' email name' };

    // $1: find mail
    const mail = await Mail.findOne(filter, {}, options).populate(optionsPop);

    // $2: upload file
    if (envelopFile) {
      const filename = generateFilename(envelopFile, mail);
      var envelopKey = crypto.encrypt(filename);
      await S3Service.uploadFile(envelopFile, filename);
    }
    if (contentFile) {
      const filename = generateFilename(contentFile, mail);
      var contentKey = crypto.encrypt(filename);
      await S3Service.uploadFile(contentFile, filename);
    }

    // $3: update mail
    const update = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      envelopKey: envelopKey,
      contentPDFKey: contentKey,
      'flags.read': false,
      'flags.issue': false,
      status: contentKey ? 'SCANNED_ARCHIVED' : undefined,
      updatedAt: Date.now()
    };
    for (const param in update) if (!update[param]) delete update[param];
    const result = await Mail.updateOne(filter, { $set: update }, options);
    if (result.n === 0) console.log('no mail is put updated');

    // $4: send email
    const receiver = mail.receiverId;
    if (contentFile) {
      await EmailService.mailScannedNotification(receiver, contentFile);
    }

    // complete transaction and closes session
    await session.commitTransaction();
    session.endSession();

    // $5: invoice and stripe
    if (contentFile) {
      let succeeded = false;
      for (let i = 0; i < 3 && !succeeded; i++) {
        try {
          await InvoiceService.newScan(receiver._id, mail._id);
          succeeded = true;
        } catch (error) {
          console.error(error);
        }
      }
    }

    // success response
    res.status(201).json({
      message: 'Mail put updated successfully',
      mail: mail
    });
  } catch (err) {
    console.log(err);

    // closes transaction and session
    await session.abortTransaction();
    session.endSession();

    // error response
    res.status(500).json({
      message: 'Failed to put update mail'
    });
  }
};
