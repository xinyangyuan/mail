const mongoose = require('mongoose');

const Address = require('../models/address');
const User = require('../models/user');

/*
Function: get list of all addresses [GET]
*/

exports.getAddressList = async (req, res) => {
  console.log('getAddressList is called');
  try {
    // projection:
    const projection = { senderId: 0, receiverIds: 0, __v: 0 };

    // $1: get address list
    const addresses = await Address.find({}, projection).lean();

    // success respons
    res.status(200).json({ message: 'success', addressList: addresses });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to get address list' });
  }
};

/*
  Function: get one address [GET]
*/

exports.getAddress = async (req, res) => {
  console.log('getAddress is called');
  try {
    // $1: get address
    const address = await Address.findById(req.params.id).lean();
    if (!address) {
      return res.status(400).json({ message: 'Cannot find the address' });
    }

    // success response
    res.status(200).json({
      address: {
        _id: address._id,
        address: address.address,
        address2: address.address2,
        city: address.city,
        zipCode: address.zipCode,
        country: address.country
      }
    });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find the address' });
  }
};

/*
  Function: get one address information [GET]
*/

exports.getAddressInfo = async (req, res) => {
  console.log('getAddressInfo is called');
  try {
    // optionsPop
    const optionsPop = { path: 'receiverIds', select: '_id name' };

    // $1
    const address = await Address.findOne()
      .bySender(req.userData.userId)
      .populate(optionsPop);

    // success response
    res.status(200).json({
      addressInfo: {
        _id: address._id,
        address: address.address,
        address2: address.address2,
        city: address.city,
        zipCode: address.zipCode,
        country: address.country,
        senderId: address.senderId,
        receiverIds: address.receiverIds // an object array [{_id: string, name: {first: string, last: string}}]
      }
    });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find your address' });
  }
};

/*
  Function: create one new address [POST]
*/

exports.createAddress = async (req, res, next) => {
  console.log('createAddress is called');
  try {
    // $1: save address
    const address_ = new Address({
      address: req.body.address,
      address2: req.body.address2,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
      senderId: req.userData.userId,
      receiverIds: []
    });
    const address = await address_.save();

    // success response
    res.status(201).json({ addressInfo: address });
  } catch {
    // error response
    res.status(500).json({ message: 'Unable to create new address' });
  }
};

/*
  Function: add one extra receiver to an address [PATCH]
*/

exports.addReceiver = async (req, res) => {
  console.log('addReceiver is called');

  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // filter, options, and update
    const filter = { _id: req.body.addressId };
    const filter2 = { _id: req.userData.userId };

    const update = {
      $addToSet: { receiverIds: mongoose.Types.ObjectId(req.userData.userId) }
    };
    const update2 = {
      address: mongoose.Types.ObjectId(req.body.addressId)
    };

    const options = { session: session, runValidators: true };

    // 1$: update address document
    const address = await Address.findOneAndUpdate(filter, update, options);

    // 2$: update user document
    await User.updateOne(filter2, update2, options);

    // complete transaction and session
    await session.commitTransaction();
    session.endSession();

    // send the response to frontend

    res.status(201).json({
      address: {
        _id: address._id,
        address: address.address,
        address2: address.address2,
        city: address.city,
        zipCode: address.zipCode,
        country: address.country
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      message: 'Failed to add new reciever to the address'
    });
  }
};
