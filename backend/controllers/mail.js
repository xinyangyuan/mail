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
  console.log('getMailList is called');

  // get search criteria and prepare db request template
  let searchCriteria = getUserSearchCriteria(req);
  searchCriteria = { ...searchCriteria, ...req.queryData.filterBy };

  // async query: get total mail count from database
  const mailQuery = Mail.find(searchCriteria, { envelopKey: 0, contentPDFKey: 0 });
  const { error: err, data: mailCount } = await async_wrapper(mailQuery.countDocuments());

  // async query:get mails from database
  const { error: error, data: fetchedMails } = await async_wrapper(
    Mail.find(searchCriteria, { envelopKey: 0, contentPDFKey: 0 }, req.queryData.sortBy)
      .skip(req.queryData.skip)
      .limit(Math.min(req.queryData.limit, mailCount)) // cap limit with mailCount
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
  Function: fetch single mail by id [GET]
*/

exports.getMail = async (req, res, next) => {
  console.log('getMail is called');

  // get search criteria and prepare db request template
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.param.id;

  // async query:get mails from database
  const { error: error, data: fetchedMail } = await async_wrapper(
    Mail.findOne(searchCriteria, { envelopKey: 0, contentPDFKey: 0 })
  );

  if (error || !fetchedMail) {
    return res.status(500).json({
      message: 'Failed to fetch mail!'
    });
  }

  // send fetched mails to frontend
  res.status(200).json({
    message: 'Mail fetched successfully.',
    mail: fetchedMail
  });
};

/*
  Function: update flags OR status associated with mails [PATCH]
*/

exports.updateMails = async (req, res, next) => {
  console.log('updateMails is called');
  // define search criteria :: make sure the request from mail's sender/user
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = { $in: req.queryData.ids };

  // toggle terminated flag
  const isTerminated = req.body.status === 'COLLECTED' || req.body.status === 'TRASHED';

  // prepare update
  const update = {
    'flags.read': typeof req.body.flags !== 'undefined' ? req.body.flags.read : undefined,
    'flags.star': typeof req.body.flags !== 'undefined' ? req.body.flags.star : undefined,
    'flags.issue': req.body.status === 'RE_SCANNING' ? true : undefined, // only triggered by issue re-scanning
    'flags.terminated': isTerminated ? true : undefined, // only triggered by collected || trashed
    status: typeof req.body.status !== 'undefined' ? req.body.status : undefined
  };
  update.status = req.body.flags.issue ? 'RE_SCANNING' : undefined;
  Object.keys(update).forEach(key => (update[key] === undefined ? delete update[key] : ''));

  // async function to update one mail's flag and get the updated doc
  const { error, data: result } = await async_wrapper(
    Mail.updateMany(
      searchCriteria,
      { $set: update },
      {
        fields: { envelopKey: 0, contentPDFKey: 0 },
        runValidators: true // run mongoose validators to check updated field type
      }
    )
  );

  if (error || result.n === 0) {
    return res.status(500).json({
      message: 'Failed to toggle mail flag(s)!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail flag(s) set successfully.',
    mail: result
  });
};

/*
  Function: update flags OR status associated with the mail [PATCH]
*/

exports.updateMail = async (req, res, next) => {
  console.log('updateMail is called');
  // define search criteria :: make sure the request from mail's sender/user
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // toggle terminated flag
  const isTerminated = req.body.status === 'COLLECTED' || req.body.status === 'TRASHED';

  // prepare update
  const update = {
    'flags.read': typeof req.body.flags !== 'undefined' ? req.body.flags.read : undefined,
    'flags.star': typeof req.body.flags !== 'undefined' ? req.body.flags.star : undefined,
    'flags.issue': req.body.status === 'RE_SCANNING' ? true : undefined, // only triggered by issue re-scanning
    'flags.terminated': isTerminated ? true : undefined, // only triggered by collected || trashed
    status: typeof req.body.status !== 'undefined' ? req.body.status : undefined
  };
  Object.keys(update).forEach(key => (update[key] === undefined ? delete update[key] : ''));

  // async function to update one mail's flag and get the updated doc
  const { error, data: result } = await async_wrapper(
    Mail.updateOne(
      searchCriteria,
      { $set: update },
      {
        fields: { envelopKey: 0, contentPDFKey: 0 },
        runValidators: true
      }
    )
  );

  if (error || result.n === 0) {
    return res.status(500).json({
      message: 'Failed to toggle mail flag(s)!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail flag(s) set successfully.',
    mail: result
  });
};

/*
  Function: delete mails [DELETE]
*/
exports.deleteMails = async (req, res, next) => {
  // define search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = { $in: req.queryData.ids };

  // async function to update one mail's flag
  const { error, data: deletionResult } = await async_wrapper(
    Mail.deleteMany(searchCriteria, { envelopKey: 0, contentPDFKey: 0 })
  );

  if (error || deletionResult.deletedCount) {
    return res.status(500).json({
      message: 'Failed to delete mail!'
    });
  }

  // send DELETE request's result to frontend
  res.status(201).json({
    message: 'Mail deleted successfully.'
  });
};

/*
  Function: delete a mail [DELETE]
*/
exports.deleteMail = async (req, res, next) => {
  // define search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // sender cannot delete scanned mails
  // if (req.userData.isSender) searchCriteria['status'] = 'CREATED';

  // async function to update one mail's flag
  const { error, data: deletionResult } = await async_wrapper(
    Mail.deleteOne(searchCriteria, { envelopKey: 0, contentPDFKey: 0 })
  );

  if (error || deletionResult.deletedCount === 0) {
    return res.status(500).json({
      message: 'Failed to delete mail!'
    });
  }

  // send DELETE request's result to frontend
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
  console.log('getContentPDF is called');
  // get search criteria
  const searchCriteria = getUserSearchCriteria(req);
  searchCriteria['_id'] = req.params.id;

  // async function to get the requested mail from database
  const { err, data: fetchedMail } = await async_wrapper(
    Mail.findOneAndUpdate(searchCriteria, { $set: { 'flags.read': true } })
  );
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
  // check is there error in file type outputed by multer || no envelop image uploaded
  if (req.fileTypeError || typeof req.fileData.envelopKey === 'undefined') {
    const message = req.error || 'Unable to find envelop image!';
    return res.status(401).json(message);
  }

  // check whether recipient is provided TODO
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
      message: 'Cannot send mail to this user!' // this will expose that this is a valid USERID !! TODOTODOTODO
    });
  }

  // encrypt s3 keys beofre save to database
  const envelopKey = crypto.encrypt(req.fileData.envelopKey);
  const contentPDFKey =
    typeof req.fileData.contentPDFKey !== 'undefined'
      ? crypto.encrypt(req.fileData.contentPDFKey)
      : undefined;

  // prepare the mail contents
  const mail = new Mail({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    senderId: mongoose.Types.ObjectId(req.userData.userId),
    receiverId: mongoose.Types.ObjectId(req.body.receiverId),
    envelopKey: envelopKey,
    contentPDFKey: contentPDFKey, // undefined will automatically trimmed by mongoose
    status: 'CREATED'
  });

  // async function to save mail into database
  const { data: fetchedMail, error } = await async_wrapper(mail.save());

  if (error) {
    console.log(error);
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

/*
  Function: modify a mail (change mail text content, envelop image, upload content pdf) [PUT]
*/
exports.modifyMail = async (req, res, next) => {
  console.log('modifyMail is called');
  // check is there error in file type outputed by multer
  if (req.fileTypeError) {
    return res.status(401).json(req.error);
  }

  // encrypt s3 keys beofre save to database
  const envelopKey =
    typeof req.fileData.envelopKey !== 'undefined'
      ? crypto.encrypt(req.fileData.envelopKey)
      : undefined;
  const contentPDFKey =
    typeof req.fileData.contentPDFKey !== 'undefined'
      ? crypto.encrypt(req.fileData.contentPDFKey)
      : undefined;

  console.log(req.fileData.envelopKey);
  console.log(req.fileData.contentPDFKey);

  // prepare the mail contents
  const update = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    envelopKey: envelopKey,
    contentPDFKey: contentPDFKey,
    'flags.read': false,
    'flags.issue': false,
    status: contentPDFKey ? 'SCANNED_ARCHIVED' : undefined,
    updatedAt: Date.now()
  };
  for (const param in update) if (!update[param]) delete update[param]; // trim undefined fields in update

  // async function to save mail into database
  const { data: result, error } = await async_wrapper(
    Mail.updateOne(
      { _id: req.params.id, senderId: req.userData.userId, 'flags.terminated': false },
      { $set: update },
      {
        fields: { envelopKey: 0, contentPDFKey: 0 },
        runValidators: true // run mongoose validators to check updated field type
      }
    )
  );

  if (error || result.n === 0) {
    return res.status(500).json({
      message: 'Failed to update the mail!'
    });
  }

  // send PUT request's result to frontend
  res.status(201).json({
    message: 'Mail updated successfully.',
    mail: result
  });
};
