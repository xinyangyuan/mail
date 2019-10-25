const mongoose = require('mongoose');
const asyncHandler = require('../utils/async-handler');

const Payment = require('../models/payment');
const ErrorResponse = require('../utils/error-response');

/* 
  @desc     Get all payments - asscociated to the requested user
  @route    [GET] /api/v1/payment
  @access   Private
*/

exports.getPayments = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection
  const filter = { _id: req.params.id };

  // $1: payments
  const payments = await Payment.find(filter)
    .byUser(userId, userRole)
    .lean();

  // success response
  res.status(200).json({ ok: true, data: { payments } });
});

/* 
  @desc     Get one payment by id 
  @route    [GET] /api/v1/payment/:id
  @access   Private
*/

exports.getPayment = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection
  const filter = { _id: req.params.id };

  // $1: payment
  const payment = await Payment.findOne(filter)
    .byUser(userId, userRole)
    .lean();
  if (!payment) return next(new ErrorResponse('Cannot find the payment', 400));

  // success response
  res.status(200).json({ ok: true, data: { payment } });
});
