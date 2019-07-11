const Mail = require('../models/mail');
const Address = require('../models/address');
const mongoose = require('mongoose');

/*
  Async helper function
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Function: fetch mails belongs to the user or sent by the sender [GET]
*/

exports.getMailList = async (req, res, next) => {
  // query requirements
  const isSender = req.userData.isSender;
  const receiverId = req.query.receiverId;

  // fake sender tries to fetch other user's mails
  // added for better 401 error handling
  if (receiverId && !isSender) {
    res.status(401).json({ message: 'Get you:) you are not authorized!' });
  }

  // define search criteria
  if (isSender && receiverId) {
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

  // async function to get mails from database
  const { error, data: fetchedMails } = await async_wrapper(Mail.find(searchCriteria));
  if (error || !fetchedMails || !fetchedMails.length) {
    return res.status(500).json({
      message: 'Failed to fetch mails!'
    });
  }

  // send fetched mails to frontend
  res.status(200).json({
    message: 'Mails fetched successfully.',
    mailList: fetchedMails
  });
};

/*
  Function: update flags associated with the mail [PATCH] HAS DANGER!
*/

exports.updateMail = async (req, res, next) => {
  // define search criteria :: make sure the request from mail's sender/user
  const isSender = req.userData.isSender;
  if (isSender) {
    searchCriteria = { _id: req.params.id, senderId: req.userData.userId };
  } else {
    searchCriteria = { _id: req.params.id, receiverId: req.userData.userId };
  }

  // req.params retrieve route parameters in the path portion of URL
  // To do: this is awfully verbose..
  const update = {};
  if (typeof req.body.read_flag !== 'undefined') {
    update.read_flag = req.body.read_flag;
  }
  if (typeof req.body.star_flag !== 'undefined') {
    update.star_flag = req.body.star_flag;
  }

  // async function to update one mail's flag and get the updated doc
  const { error, data: fetchedMail } = await async_wrapper(
    Mail.findByIdAndUpdate(searchCriteria, update, { new: true })
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
  Function: delete a mail [DELETE]
*/
exports.deleteMail = async (req, res, next) => {
  // define search criteria
  const isSender = req.userData.isSender;
  if (isSender) {
    searchCriteria = { _id: req.params.id, senderId: req.userData.userId };
  } else {
    searchCriteria = { _id: req.params.id, receiverId: req.userData.userId };
  }

  // async function to update one mail's flag
  const { error, data: fetchedMail } = await async_wrapper(Mail.deleteOne(searchCriteria));

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
  Function: send a new mail [POST]
*/

exports.createMail = async (req, res, next) => {
  // check the user belongs to the sender
  const { error: err, data: senderReceiverValid } = await async_wrapper(
    Address.find({
      senderId: req.userData.userId,
      receiverId: req.query.receiverId
    })
  );

  if (err || !senderReceiverValid) {
    return res.status(401).json({
      message: 'Cannot send mail to this user!'
    });
  }

  // prepare the mail contents
  const mail = new Mail({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    senderId: mongoose.Types.ObjectId(req.userData.userId),
    receiverId: mongoose.Types.ObjectId(req.query.receiverId),
    read_flag: false,
    star_flag: false
  });

  // async function to save mail into database
  const { data: fetchedMail, error } = await async_wrapper(mail.save());

  if (error) {
    return res.status(500).json({
      message: 'Failed to send the new mail!'
    });
  }

  // send POST request's result to frontend
  res.status(201).json({
    message: 'Mail sent successfully.',
    mail: fetchedMail
  });
};
