const mongoose = require('mongoose');

const Address = require('../models/address');

/*
  Add Receiver:
*/

exports.addReceiver = async (addressId, userId, mailboxNo, session) => {
  // filter, options, and update
  const filter = {
    _id: addressId,
    'receivers.mailboxNo': { $ne: mailboxNo },
    'receivers.receiverId': { $ne: userId }
  };
  const update = { $push: { receivers: { mailboxNo: mailboxNo, receiverId: userId } } };
  const options = session
    ? { runValidators: true, new: true }
    : { runValidators: true, new: true, session };

  // promise
  const address = await Address.findOneAndUpdate(filter, update, options);
  return address;
};

/*
  Remove Receiver:
*/

exports.removeReceiver = async (addressId, userId) => {
  // filter, options, and update
  const filter = { _id: addressId };
  const update = { $pull: { receivers: { receiverId: userId } } };
  const options = { runValidators: true, new: true };

  // promise
  const address = await Address.findOneAndUpdate(filter, update, options);
  return address;
};

/*
  Update address:
*/

exports.updateAddressById = (id, line1, line2, city, country, zip) => {
  // filter, options
  const filter = { _id: id };
  const options = { runValidators: true, new: true };

  // update
  let update;
  line1 && (update['line1'] = line1);
  line2 && (update['line2'] = line2);
  city && (update['city'] = city);
  country && (update['country'] = country);
  zip && (update['zip'] = zipp);

  // document query
  return Address.updateOne(filter, update, options);
};

/*
  Find address by id
*/

exports.findAddressById = addressId => {
  // filter
  const filter = { _id: addressId };

  // document query
  return Address.findOne(filter);
};

/*
  Find address by sender & receiver ids pair:
*/

exports.findAddressBySenderReceiverIds = (senderId, receiverId) => {
  // filter
  const filter = {
    senderId: mongoose.Types.ObjectId(senderId),
    'receivers.receiverId': mongoose.Types.ObjectId(receiverId)
  };

  // document query
  return Address.findOne(filter);
};
