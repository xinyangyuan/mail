const mongoose = require('mongoose');

const Address = require('../models/address');
const User = require('../models/user');

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
    const addresses = await Address.find({}, projection);

    // //    addressList = addresses.map(address => {
    //     return {
    //       line1: address.line1,
    //       line2: address.line2,
    //       city: address.city,
    //       zip: address.zip,
    //       country: address.country,
    //       vacantMailboxNos: address.vacantMailboxNos
    //     };
    //   });

    // success respons
    res.status(200).json({
      message: 'success',
      addressList: addresses
    });
  } catch (err) {
    console.log(err);
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
    // PROJECT
    const projection = { senderId: 0, 'receivers.receiverId': 0, __v: 0 };

    // $1: get address
    const address = await Address.findById(req.params.id, projection);
    if (!address) {
      return res.status(400).json({ message: 'Cannot find the address' });
    }

    // success response
    res.status(200).json({
      address: {
        _id: address._id,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        zip: address.zip,
        country: address.country,
        vacantMailboxNos: address.vacantMailboxNos
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
    const optionsPop = { path: 'receivers.receiverId', select: '_id name' };

    // $1
    const address = await Address.findOne()
      .bySender(req.userData.userId)
      .populate(optionsPop);
    console.log(address);

    // success response
    res.status(200).json({
      addressInfo: {
        _id: address._id,
        address: address.line1,
        address2: address.line2,
        city: address.city,
        zipCode: address.zip,
        country: address.country,
        senderId: address.senderId,
        receivers: address.receivers // an object array [{_id: string, name: {first: string, last: string}}]
      }
    });
  } catch (error) {
    console.log(error);
    // error response
    res.status(500).json({ message: 'Failed to find your address' });
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
      line1: req.body.address,
      line2: req.body.address2,
      city: req.body.city,
      zip: req.body.zipCode,
      country: req.body.country,
      senderId: req.userData.userId
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
  // validation
  if (!req.body.addressId) return res.status(400).json({ message: 'Please provide address' });

  try {
    // addressId, userId, mailboxNo
    const addressId = mongoose.Types.ObjectId(req.body.addressId);
    const userId = mongoose.Types.ObjectId(req.userData.userId);
    const mailboxNo = req.body.mailboxNo;

    // $1: add user to address
    const address = await AddressService.addReceiver(addressId, userId, mailboxNo);

    // success response
    res.status(201).json({
      address: {
        _id: address._id,
        address: address.line1,
        address2: address.line2,
        city: address.city,
        zipCode: address.zip,
        country: address.country
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to add new reciever to the address'
    });
  }
};
