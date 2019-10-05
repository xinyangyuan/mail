const mongoose = require('mongoose');

const Address = require('../models/address');

/*
  Add Receiver:
*/

exports.addReceiver = async (addressId, userId, mailboxNo, session = null) => {
  try {
    // filter, options, and update
    const filter = {
      _id: addressId,
      'receivers.mailboxNo': { $ne: mailboxNo },
      'receivers.receiverId': { $ne: userId }
    };
    const update = { $push: { receivers: { mailboxNo: mailboxNo, receiverId: userId } } };
    const options = session ? { session: session, runValidators: true } : { runValidators: true };

    // 1$: update address document
    const address = await Address.findOneAndUpdate(filter, update, options);
    if (!address) {
      throw Error(`User already exits in the addresss's mailbox`);
    }

    // return address
    return address;
  } catch (error) {
    throw error;
  }
};
