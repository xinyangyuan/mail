const asyncHandler = require('../utils/async-handler');

const Invoice = require('../models/invoice');
const ErrorResponse = require('../utils/error-response');

/* 
  @desc     Get all invoices - asscociated to the requested user
  @route    [GET] /api/v1/invoice
  @access   Private
*/

exports.getInvoices = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection, sort, skip, limit
  const { filter, sort, skip, limit } = req.queryData;
  if (userRole !== 'ADMIN') {
    delete filter.userId;
  }

  // $1: invoices
  const invoices = await Invoice.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .byUser(userId, userRole)
    .lean();

  // success response
  res.status(200).json({ ok: true, data: { invoices } });
});

/* 
  @desc     Get one invoice by id - if the requested invoice is asscociated to the requested user
  @route    [GET] /api/v1/invoice/:id
  @access   Private
*/

exports.getInvoice = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // filter, projection
  const filter = { _id: req.params.id };

  // $1: mail
  const invoice = await Invoice.findOne(filter)
    .byUser(userId, userRole)
    .lean();
  if (!invoice) return next(new ErrorResponse('Cannot find the invoice', 400));

  // success response
  res.status(200).json({ ok: true, data: { invoice } });
});

/* 
  @desc     Get upcoming invoice of the requested user
  @route    [GET] /api/v1/invoice/upcoming -self
  @route    [GET] /api/v1/invoice/upcoming?userId TODO:
  @route    [GET] /api/v1/invoice/userId/:userId/upcoming TODO:
  @route    [GET] /api/v1/subscription/:subscriptionId/invoice/upcoming TODO:
  @route    [GET] /api/v1/user/:userId/invoice/upcoming TODO:
  @access   Private
*/

exports.getUpcomingInvoice = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // role permission chekck
  if (userRole === 'ADMIN') {
    return next(new ErrorResponse(`Haven't implemented query for specific user by id`, 404));
  }

  // filter, projection
  const filter = { userId };

  // $1: mail
  const invoice = await Invoice.findOne(filter)
    .currentPeriod()
    .byUser(userId, userRole)
    .lean();
  if (!invoice) return next(new ErrorResponse('Cannot find the invoice', 400));

  // success response
  res.status(200).json({ ok: true, data: { invoice } });
});
