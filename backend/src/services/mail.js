const mongoose = require('mongoose');
const encrypt = require('../utils/encrypt');

const Mail = require('../models/mail');

/*
  Service: send a welcome mail to newly sign-up user inbox
*/

exports.sendWelcomeMail = async (user, session) => {
  // welcome mail
  const mail = new Mail({
    title: 'Hello: ' + user.fullName + '!',
    description: 'Your first virtual mail is here!',
    content: 'Hope you have a great time using it!',
    senderId: mongoose.Types.ObjectId(user._id),
    receiverId: mongoose.Types.ObjectId(user._id),
    status: 'SCANNED_ARCHIVED',
    envelopKey: encrypt.encrypt('welcome.jpg'),
    contentPDFKey: encrypt.encrypt('welcome.pdf')
  });

  // send welcome mail
  await mail.save({ session });
};

/*
  Service: generate update fields for patch update request
*/

exports.generateMailUpdate = body => {
  const update = {};
  // read flag
  if (body.flags && body.flags.read) {
    update['flags.read'] = body.flags.read;
  }
  // star flag
  if (body.flags && body.flags.star) {
    update['flags.star'] = body.flags.star;
  }
  // issue flag - trigger by status changed to ISSUE RE-SCANNING
  if (body.status === 'RE_SCANNING') {
    update['flags.terminated'] = true;
  }
  // terminated flag - trigger status changed to COLLECTED || TRASHED
  if (body.status === 'COLLECTED' || body.status === 'TRASHED') {
    update['flags.terminated'] = true;
  }
  // status
  if (body.status) {
    update['status'] = body.status;
  }
  return { $set: update };
};

/*
  Service: put update mail
*/

exports.putUpdateMail = (id, title, description, content, envelopKey, contentPDFKey) => {
  // update
  const update = {
    updatedAt: Date.now(),
    'flags.issue': false,
    'flags.read': false
  };

  // update fields
  if (title) {
    update['title'] = title;
  }
  if (description) {
    update['description'] = description;
  }
  if (content) {
    update['content'] = title;
  }
  if (envelopKey) {
    update['envelopKey'] = envelopKey;
  }
  if (contentPDFKey) {
    update['contentPDFKey'] = contentPDFKey;
    update['status'] = 'SCANNED_ARCHIVED';
  }

  return Mail.updateOne({ _id: id }, update, { runValidators: true, new: true });
};

// account credit check
// if (isOverage && !subscription.isAllowOverage) {
//   return next(new ErrorResponse('Receiver has already exceed plan credit', 400));
// }
