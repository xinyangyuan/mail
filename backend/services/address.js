const mongoose = require('mongoose');

const Address = require('../models/address');
const User = require('../models/user');

/*
  Add Receiver:
*/

exports.addReceiver = async (addressId, userId, mailboxNo, session = null) => {
  // create session if none provided
  let isIsolateTransaction = false;
  if (!session) {
    isIsolateTransaction = true;
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    // filter, options, and update
    let filter = {
      _id: addressId,
      'receivers.mailboxNo': { $ne: mailboxNo },
      'receivers.receiverId': { $ne: userId }
    };
    let update = { $push: { receivers: { mailboxNo: mailboxNo, receiverId: userId } } };
    const options = { session: session, runValidators: true };

    // 1$: update address document
    const address = await Address.findOneAndUpdate(filter, update, options);
    if (!address) {
      throw Error(`User already exits in the addresss's mailbox`);
    }

    // 2$: update user document
    filter = {
      _id: userId,
      'mailboxes.mailboxNo': { $ne: mailboxNo },
      'mailboxes.addressId': { $ne: addressId }
    };
    update = { $push: { mailboxes: { mailboxNo: mailboxNo, addressId: addressId } } };
    await User.updateOne(filter, update, options);

    // complete transaction and session
    if (isIsolateTransaction) {
      await session.commitTransaction();
      session.endSession();
    }

    // return address
    return address;
  } catch (error) {
    // abort transaction and end session
    if (isIsolateTransaction) {
      await session.abortTransaction();
      session.endSession();
    }
    throw error;
  }
};
