const mongoose = require('mongoose');
const crypto = require('../utils/encrypt');
const s3 = require('../utils/aws');

const Mail = require('../models/mail');
const Address = require('../models/address');

/*
  Helper Function: Go-lang style async wrapper
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Helper Function: generate search criteria based on user status and req querry
*/

const getUserSearchCriteria = req => {
  // query requirements
  const isSender = req.userData.isSender;
  const receiverId = req.query.receiverId;
  const receiverExist = typeof receiverId !== 'undefined';

  // fake sender tries to fetch other user's mails
  // added for better 401 error handling
  if (receiverExist && !isSender) {
    res.status(401).json({ message: 'Get you:) you are not authorized!' });
  }

  // define search criteria (what query is null)
  if (isSender && receiverExist) {
    // request is sent from a mail sender, and he wants to get his specific
    // recipient's mails
    searchCriteria = { receiverId: receiverId, senderId: req.userData.userId };
  } else if (isSender) {
    // request is sent from a mail sender, and he wants to get all mails that
    // he sent
    searchCriteria = { senderId: req.userData.userId };
  } else {
    // request is sent from a normal mail user
    searchCriteria = { receiverId: req.userData.userId };
  }

  return searchCriteria;
};

/*
  Function: fetch mails belongs to the user or sent by the sender [GET]
*/

exports.getMailList = async (req, res, next) => {
  // get search criteria and prepare db request template
  const searchCriteria = getUserSearchCriteria(req);

  if (typeof req.query.readFlag !== 'undefined') {
    searchCriteria['flags.read'] = req.query.readFlag === 'true'; // read filter
  }
  if (typeof req.query.starFlag !== 'undefined') {
    searchCriteria['flags.star'] = req.query.starFlag === 'true'; // star filter
  }
  if (typeof req.query.issueFlag !== 'undefined') {
    searchCriteria['flags.issue'] = req.query.issueFlag === 'true'; // issue filter
  }

  const mailQuery = Mail.find(searchCriteria, { envelopKey: 0, contentPDFKey: 0 });

  // async query: get total mail count from database
  const { error: err, data: mailCount } = await async_wrapper(mailQuery.countDocuments());

  // get pagination requirements from querry
  const mailPerPage = +req.query.mailsPerPage;
  const currentPage = +req.query.currentPage;

  // sort method
  const sort = { sort: { createdAt: -1 } }; // default: sort by date descending order
  if (
    ['title', '-title', 'createdAt', '-createdAt', 'content', '-content'].includes(req.query.sort)
  ) {
    sort = { sort: req.query.sort };
  }

  // async query:get mails from database TODO
  const { error: error, data: fetchedMails } = await async_wrapper(
    Mail.find(searchCriteria, { envelopKey: 0, contentPDFKey: 0 }, sort)
      .skip(mailPerPage && currentPage ? mailPerPage * (currentPage - 1) : 0)
      .limit(mailPerPage && currentPage ? mailPerPage : mailCount)
  );

  if (err || error || !fetchedMails) {
    return res.status(500).json({
      message: 'Failed to fetch mails!'
    });
  }

  // send fetched mails to frontend
  res.status(200).json({
    message: 'Mails fetched successfully.',
    mailList: fetchedMails,
    mailCount: mailCount
  });
};

/*
  Function: update flags associated with the mail [PATCH] HAS DANGER!
*/

exports.updateMails = async (req, res, next) => {
  console.log('update is called');
  // define search criteria :: make sure the request from mail's sender/user
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = { $in: [req.query.ids.split(',')] };

  // req.params retrieve route parameters in the path portion of URL
  // ToDo: this is awfully verbose..
  const update = {};

  if (typeof req.body.readFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.read'] = req.body.readFlag;
  }
  if (typeof req.body.starFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.star'] = req.body.starFlag;
  }
  if (typeof req.body.issueFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.issue'] = req.body.issueFlag;
  }

  // async function to update one mail's flag and get the updated doc
  const { error, data: fetchedMail } = await async_wrapper(
    Mail.findByIdAndUpdate(
      searchCriteria,
      { $set: update },
      {
        fields: { envelopKey: 0, contentPDFKey: 0 },
        new: true,
        runValidators: true
      }
    )
  );

  if (error || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to toggle mail flag(s)!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail flag(s) set successfully.',
    mail: fetchedMail
  });
};

/*
  Function: update flags associated with the mail [PATCH] HAS DANGER!
*/

exports.updateMail = async (req, res, next) => {
  console.log('update is called');
  // define search criteria :: make sure the request from mail's sender/user
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // req.params retrieve route parameters in the path portion of URL
  // ToDo: this is awfully verbose..
  const update = {};

  if (typeof req.body.readFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.read'] = req.body.readFlag;
  }
  if (typeof req.body.starFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.star'] = req.body.starFlag;
  }
  if (typeof req.body.issueFlag === 'boolean' /*&& !req.userData.isSender*/) {
    update['flags.issue'] = req.body.issueFlag;
  }

  // async function to update one mail's flag and get the updated doc
  const { error, data: fetchedMail } = await async_wrapper(
    Mail.findByIdAndUpdate(
      searchCriteria,
      { $set: update },
      {
        fields: { envelopKey: 0, contentPDFKey: 0 },
        new: true,
        runValidators: true
      }
    )
  );

  if (error || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to toggle mail flag(s)!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail flag(s) set successfully.',
    mail: fetchedMail
  });
};

/*
  Function: delete mails [DELETE]
*/
exports.deleteMails = async (req, res, next) => {
  // define search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = { $in: [req.query.ids.split(',')] };

  // async function to update one mail's flag
  const { error, data: fetchedMail } = await async_wrapper(
    Mail.deleteMany(searchCriteria, { envelopKey: 0, contentPDFKey: 0 })
  );

  if (error || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to delete mail!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail deleted successfully.',
    mail: fetchedMail
  });
};

/*
  Function: delete a mail [DELETE]
*/
exports.deleteMail = async (req, res, next) => {
  // define search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // async function to update one mail's flag
  const { error, data: deletionResult } = await async_wrapper(
    Mail.deleteOne(searchCriteria, { envelopKey: 0, contentPDFKey: 0 })
  );

  if (error) {
    return res.status(500).json({
      message: 'Failed to delete mail!'
    });
  }
  //console.log(deletionResult.deletedCount);
  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail deleted successfully.'
  });
};

/*
  Function: get envelop image of one mail [GET]
*/

exports.getEnvelop = async (req, res, next) => {
  // get search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // async function to get the requested mail from database
  const { err, data: fetchedMail } = await async_wrapper(Mail.findOne(searchCriteria));
  if (err || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to find the mail!'
    });
  }

  // eject on empty key  TODELET!
  if (typeof fetchedMail.envelopKey === 'undefined') {
    return res.status(500).json({
      message: 'Failed to the mail envelop!'
    });
  }

  // define search params
  const key = crypto.decrypt(fetchedMail.envelopKey);
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };
  const ext = key.split('.').slice(-1)[0];

  // find file from S3 and pipe it to response
  // set res header
  res.setHeader('Content-Type', 'image/' + ext);

  // create readable stream from aws s3
  const stream = s3.getObject(params).createReadStream();

  // handle error
  stream.on('error', error => {
    stream.end(); // mannually closes the stream
    console.log('cannot find the image');
  });

  // closes redableStream
  req.on('close', () => {
    stream.end(); // if request is cancelled, also closes the stream
  });

  // start fetching the file and pipe it to response
  stream.pipe(res);
};

/*
  Function: get one mail's content PDF [GET]
*/
exports.getContentPDF = async (req, res, next) => {
  // get search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // async function to get the requested mail from database
  const { err, data: fetchedMail } = await async_wrapper(Mail.findOne(searchCriteria));
  if (err || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to find the mail!'
    });
  }

  // eject on empty key  TODELET!
  if (typeof fetchedMail.contentPDFKey === 'undefined') {
    return res.status(401).json({ message: 'Failed to find mail pdf!' });
  }

  // define search params
  const key = crypto.decrypt(fetchedMail.contentPDFKey);
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key
  };

  // find file from S3 and pipe it to response
  // set headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + 'Mail Content' + '"');

  // create readable stream from aws s3
  const stream = s3.getObject(params).createReadStream();

  // handle error
  stream.on('error', error => {
    stream.end(); // mannually closes the stream
  });

  // closes redableStream
  req.on('end', () => {
    stream.end(); //if request is cancelled, also closes the stream
  });

  // start fetching the file and pipe it to response
  stream.pipe(res);
};

/*
  Function: send a new mail [POST]
*/

exports.createMail = async (req, res, next) => {
  // check is there error in file type outputed by multer
  if (req.error) {
    return res.status(401).json(req.error);
  }

  // check whether the recipient belongs to the sender TODO
  if (typeof req.body.receiverId === 'undefined') {
    return res.status(401).json({
      message: 'Please specify the recipient!'
    });
  }

  const { error: err, data: senderReceiverValid } = await async_wrapper(
    Address.findOne({
      senderId: req.userData.userId,
      // ISSUE: if receiver is empty always true!!!!
      // Although mail cannot be save due to required schema
      receiverIds: req.body.receiverId
    })
  );

  if (err || !senderReceiverValid) {
    return res.status(401).json({
      message: 'Cannot send mail to this user!'
    });
  }

  // encrypt s3 keys beofre save to database
  const envelopKey = crypto.encrypt(req.fileData.envelopKey);
  const contentPDFKey = crypto.encrypt(req.fileData.contentPDFKey);

  // prepare the mail contents
  const mail = new Mail({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    senderId: mongoose.Types.ObjectId(req.userData.userId),
    receiverId: mongoose.Types.ObjectId(req.body.receiverId),
    envelopKey: envelopKey,
    contentPDFKey: contentPDFKey
  });

  // async function to save mail into database
  const { data: fetchedMail, error } = await async_wrapper(mail.save());

  if (error) {
    return res.status(500).json({
      message: 'Failed to send the new mail!'
    });
  }

  // send POST request's result to frontend
  delete fetchedMail.envelopKey;
  delete fetchedMail.contentPDFKey;

  res.status(201).json({
    message: 'Mail sent successfully.',
    mail: fetchedMail
  });
};
