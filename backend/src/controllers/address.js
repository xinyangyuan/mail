const mongoose = require('mongoose');
const asyncHandler = require('../utils/async-handler');

const Address = require('../models/address');
const ErrorResponse = require('../utils/error-response');

const addressService = require('../services/address');

/* 
  @desc     Get all addresses
  @route    [GET] /api/v1/addresses
  @access   Public
*/

exports.getAddresses = asyncHandler(async (req, res, next) => {
  // query parameeters
  const { filter, sort, skip, limit } = req.queryData;

  // // $1: get address list
  const addresses = await Address.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  // success respons
  res.status(200).json({ ok: true, data: { addresses } });
});

/* 
  @desc     Get a address by id
  @route    [GET] /api/v1/addresses/:id
  @access   Public
*/

exports.getAddress = asyncHandler(async (req, res, next) => {
  // $1: get address
  const address = await Address.findOne({ _id: req.params.id })
    .lean()
    .exec();

  // validation
  if (!address) {
    return next(new ErrorResponse(`Unkow address id: ${req.params.id}`, 400));
  }

  // success response
  res.status(200).json({ ok: true, data: { address } });
});

/* 
  @desc     Get address belongs to a sender
  @route    [GET] /api/v1/addresses/senderId/:senderId
  @access   Private - SENDER,ADMIN
*/

exports.getAddressBySenderId = asyncHandler(async (req, res, next) => {
  // se der only can access his address
  if (req.userData.userId !== req.params.receiverId && req.userData.role === 'SENDER') {
    console.log(`Error: ${req.userData.userId} tries to access other sender adddress info`.red);
    return next(new ErrorResponse(`No address is found`, 400));
  }

  // filter
  const filter = { senderId: req.params.senderId };

  // $1: get address
  const address = await Address.findOne(filter).lean();
  if (!address) {
    return next(`No address is found`, 400);
  }

  // success response
  res.status(200).json({ ok: true, data: { address } });
});

/* 
  @desc     Get address belongs to a receiver
  @route    [GET] /api/v1/addresses/receivers/receiverId/:receiverId
  @access   Private - USER,ADMIN
*/

exports.getAddressByReceiverId = asyncHandler(async (req, res, next) => {
  // receiver only can access his address
  if (req.userData.userId !== req.params.receiverId && req.userData.role === 'USER') {
    console.log(`Error: ${req.userData.userId} tries to access other users adddress info`.red);
    return next(new ErrorResponse(`No address is found`, 400));
  }

  // filter
  const filter = { 'receivers.receiverId': req.params.receiverId };

  // $1: get address
  const address = await Address.findOne(filter)
    .lean()
    .exec();
  if (!address) {
    return next(new ErrorResponse(`No address is found`, 400));
  }

  // success response
  res.status(200).json({ ok: true, data: { address } });
});

/* 
  @desc     Get one address with receiver details info
  @route    [GET] /api/v1/addresses/:id/receivers
  @access   Private - SENDER,ADMIN
*/

exports.getAddressReceivers = asyncHandler(async (req, res, next) => {
  // sender only can access his address
  if (req.userData.userId !== req.params.receiverId && req.userData.role === 'SENDER') {
    console.log(`Error: ${req.userData.userId} tries to access other sender adddress info`.red);
    return next(new ErrorResponse(`Unknow address id: ${req.params.id}`, 400));
  }

  // projection
  const optionsPop = { path: 'receivers.receiverId', select: ' name ' };

  // $1: get address
  const address = await Address.findById(req.params.id)
    .select('+senderId +receivers')
    .populate(optionsPop)
    .lean()
    .exec();
  if (!address) {
    return next(new ErrorResponse(`Unknow address id: ${req.params.id}`, 400));
  }

  // success response
  res.status(200).json({ ok: true, data: { address, receivers: address.receivers } });
});

/* 
  @desc     Get one address with receiver details info
  @route    [GET] /api/v1/addresses/:id/vacant_mailboxes
  @access   Public
*/

exports.getVacantMailboxNos = asyncHandler(async (req, res, next) => {
  // $1: get address
  let address = await Address.findById(req.params.id)
    .select('+receivers')
    .exec();
  if (!address) return next(new ErrorResponse(`Unknow address id: ${req.params.id}`));

  // document transformation
  const vacantMailboxNos = address.vacantMailboxNos;
  address = address.toObject({
    transform: function(doc, ret, options) {
      delete ret.receivers; // 1: remove recivers field
      ret.vacantMailboxNos = doc.vacantMailboxNos; // 2: attach vacantMailboxNos virtual
      return ret;
    }
  });

  // success response
  res.status(200).json({ ok: true, data: { address: address, vacantMailboxNos } });
});

/* 
  @desc     Create new address
  @route    [POST] /api/v1/address
  @access   Private - SENDER,ADMIN
*/

exports.createAddress = asyncHandler(async (req, res) => {
  // $1: save address [TODO: single sender can create multiple addresses]
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
  res.status(201).json({ ok: true, data: { address } });
});

/* 
  @desc     Update an address
  @route    [PATCH] /api/v1/addresses/:id
  @access   Private - SENDER,ADMIN
*/

exports.updateAddress = asyncHandler(async (req, res) => {
  // line1, line2, city, zip, country
  const id = req.params.id;
  const { line1, line2, city, country, zip } = req.body;

  // role and id
  const [userId, userRole] = [req.userData.userId, req.userData.role];

  // promise
  const result = await addressService
    .updateAddressById(id, line1, line2, city, country, zip)
    .byUser(userId, userRole);
  if (!result || result.n === 0) {
    return next(new ErrorResponse(`Unable to update address ${id} with values {req.body}`, 400));
  }

  // success response
  res.status(200).json({ ok: true, data: { n: result.n, nModified: result.nModified } });
});

/* 
  @desc     Add a receiver at an address
  @route    [POST] /api/v1/addresses/:id/receivers
  @access   Private - ADMIN
*/

exports.addReceiver = asyncHandler(async (req, res, next) => {
  // addressId, userId, mailboxNo
  const addressId = mongoose.Types.ObjectId(req.params.id);
  const userId = mongoose.Types.ObjectId(req.body.userId);
  const mailboxNo = req.body.mailboxNo;

  // $1: add user to address
  const address = await addressService.addReceiver(addressId, userId, mailboxNo);
  if (!address) return next(new ErrorResponse(`Unable to add receiver`, 400));

  // success response
  res.status(201).json({ ok: true, data: { address } });
});

/* 
  @desc     Remove a receiver at an address
  @route    [DELETE] /api/v1/addresses/:id/receivers/:receiverId
  @access   Private - ADMIN
*/

exports.removeReceiver = asyncHandler(async (req, res, next) => {
  // addressId, userId
  const addressId = mongoose.Types.ObjectId(req.params.id);
  const userId = mongoose.Types.ObjectId(req.params.receiverId);

  // $1: add user to address
  const address = await addressService.removeReceiver(addressId, userId);
  if (!address) return next(new ErrorResponse(`Unable to remove receiver`, 400));

  // success response
  res.status(200).json({ ok: true, data: { address } });
});
