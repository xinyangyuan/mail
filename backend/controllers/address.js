const mongoose = require('mongoose');

const Address = require('../models/address');

const AddressService = require('../services/address');

/*
Function: get list of all addresses [GET]
*/

exports.getAddressList = async (req, res) => {
  console.log('getAddressList is called');
  try {
    // projection:
    const projection = { senderId: 0, receivers: 0, __v: 0 };

    // $1: get address list
    const addresses = await Address.find({}, projection)
      .lean()
      .exec();

    // success respons
    res.status(200).json({ message: 'success', addressList: addresses });
  } catch (error) {
    // error response
    res.status(500).json({ message: 'Failed to get address list' });
  }
};

/*
  Function: get one address by id [GET]
*/

exports.getAddress = async (req, res) => {
  console.log('getAddress is called');
  try {
    // projection
    const projection = { senderId: 0, receivers: 0, __v: 0 };

    // $1: get address
    const address = await Address.findById(req.params.id, projection)
      .lean()
      .exec();

    if (!address) {
      return res.status(400).json({ message: 'Cannot find the address' });
    }

    // success response
    res.status(200).json({ message: 'success', address });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find the address' });
  }
};

/*
  Function: get one address's receivers filed by id [GET]
*/

exports.getAddressReceivers = async (req, res) => {
  console.log('getAddressReceivers is called');
  try {
    // projection
    const projection = { receivers: 1 };
    const optionsPop = { path: 'receivers.receiverId', select: ' name ' };

    // $1: get address
    const address = await Address.findById(req.params.id, projection)
      .populate(optionsPop)
      .lean()
      .exec();
    if (!address) {
      return res.status(400).json({ message: `Cannot find the address` });
    }

    // success response
    res.status(200).json({ message: 'success', address });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find the address' });
  }
};

/*
  Function: get one address's vacantMailboxNos virtual filed by id [GET]
*/

exports.getVacantMailboxNos = async (req, res) => {
  console.log('getVacantMailboxNos is called');
  try {
    // projection
    const projection = { receivers: 1 };

    // $1: get address
    const address = await Address.findById(req.params.id, projection).exec();
    if (!address) return res.status(400).json({ message: `Cannot find the address` });

    // success response
    res.status(200).json({
      message: 'success',
      address: { _id: address._id, vacantMailboxNos: address.vacantMailboxNos }
    });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to find the address' });
  }
};

/*
  Function: create one new address [POST]
*/

exports.createAddress = async (req, res) => {
  console.log('createAddress is called');
  try {
    // $1: save address [single sender can create multiple addresses]
    const address_ = new Address({
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      senderId: req.userData.userId
    });
    const address = await address_.save();

    // success response
    res.status(201).json({ message: 'success', address });
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
  // validation
  if (!req.body.addressId) return res.status(400).json({ message: 'Please provide address' });

  try {
    // addressId, userId, mailboxNo
    const addressId = mongoose.Types.ObjectId(req.params.id);
    const userId = mongoose.Types.ObjectId(req.userData.userId);
    const mailboxNo = req.body.mailboxNo;

    // $1: add user to address
    const address = await AddressService.addReceiver(addressId, userId, mailboxNo);

    // success response
    res.status(201).json({
      address: {
        _id: address._id,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        zip: address.zip,
        country: address.country
      }
    });
  } catch (error) {
    // error response
    console.log(error);
    res.status(500).json({ message: 'Failed to add new reciever to the address' });
  }
};
