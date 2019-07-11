const Address = require('../models/address');
const mongoose = require('mongoose');

/*
  Go-lang style async helper function
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Function: get one address [GET]
*/

exports.getAddress = async (req, res) => {
  console.log('getAddress is called');
  // async funtion: find user with matched email in db
  const { error, data: fetchedAddress } = await async_wrapper(
    Address.findOne({ receiverIds: req.userData.userId })
  );

  if (error || !fetchedAddress) {
    return res.status(401).json({
      message: 'Failed to find your address!'
    });
  }

  // send the response to frontend
  res.status(200).json({
    address: {
      _id: fetchedAddress._id,
      address: fetchedAddress.address,
      address2: fetchedAddress.address2,
      city: fetchedAddress.city,
      zipCode: fetchedAddress.zipCode,
      country: fetchedAddress.country
    }
  });
};

/*
  Function: get one address information [GET]
*/

exports.getAddressInfo = async (req, res) => {
  console.log('getAddressInfo is called');
  // async funtion: find user with matched email in db
  const { error, data: fetchedAddress } = await async_wrapper(
    Address.findOne({ senderId: req.userData.userId })
  );

  if (error || !fetchedAddress) {
    return res.status(401).json({
      message: 'Failed to find your address!'
    });
  }

  // send the response to frontend
  res.status(200).json({
    addressInfo: {
      _id: fetchedAddress._id,
      address: fetchedAddress.address,
      address2: fetchedAddress.address2,
      city: fetchedAddress.city,
      zipCode: fetchedAddress.zipCode,
      country: fetchedAddress.country,
      senderId: fetchedAddress.senderId,
      receiverIds: fetchedAddress.receiverIds
    }
  });
};

/*
  Function: get list of all addresses [GET]
*/

exports.getAddressList = async (req, res) => {
  console.log('getAddressList is called');

  // async funtion: find user with matched email in db
  const { error, data: fetchedAddresses } = await async_wrapper(
    Address.find({}, { senderId: 0, receiverIds: 0, __v: 0 }).lean()
  );

  if (error || !fetchedAddresses || !fetchedAddresses.length) {
    return res.status(401).json({
      message: 'Failed to find your address!'
    });
  }

  // send the response to frontend
  res.status(200).json({
    addressList: fetchedAddresses
  });
};

/*
  Function: create one new address [POST]
*/

exports.createAddress = async (req, res) => {
  console.log('createAddress is called');
  // patch all fields from request
  const address = new Address({
    address: req.body.address,
    address2: req.body.address2,
    city: req.body.city,
    zipCode: req.body.zipCode,
    country: req.body.country,
    senderId: req.userData.userId,
    receiverIds: []
  });

  // async funtion: create new address in db
  const { error, data: fetchedAddress } = await async_wrapper(address.save());

  if (error || !fetchedAddress) {
    return res.status(401).json({
      message: 'Failed to create a new address!'
    });
  }

  // send the response to frontend
  res.status(201).json({
    addressInfo: fetchedAddress
  });
};

/*
  Function: add one extra receiver to an address [PATCH]
*/

exports.addReceiver = async (req, res) => {
  console.log('addReceiver is called');
  // prepare the update; $addToSet ensure all array ids are uniques
  const update = {
    $addToSet: { receiverIds: mongoose.Types.ObjectId(req.userData.userId) }
  };

  // async funtion: push a new user into address doc's receiverId field
  const { error, data: fetchedAddress } = await async_wrapper(
    Address.findOneAndUpdate({ _id: req.body.addressId }, update)
  );

  if (error || !fetchedAddress) {
    console.log(req.userData.userId);
    return res.status(401).json({
      message: 'Failed to add new reciever to the address!'
    });
  }

  // send the response to frontend
  res.status(201).json({
    address: {
      _id: fetchedAddress._id,
      address: fetchedAddress.address,
      address2: fetchedAddress.address2,
      city: fetchedAddress.city,
      zipCode: fetchedAddress.zipCode,
      country: fetchedAddress.country
    }
  });
};
