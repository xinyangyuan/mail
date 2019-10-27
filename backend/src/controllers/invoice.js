const asyncHandler = require('../utils/async-handler');

const Invoice = require('../models/invoice');
const ErrorResponse = require('../utils/error-response');

const invoiceService = require('../services/invoice');
const subscriptionService = require('../services/subscription');

/* 
  @desc     Get all invoices - asscociated to the requested user
  @route    [GET] /api/v1/invoices
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
  @route    [GET] /api/v1/invoices/:id
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
  if (!invoice) return next(new ErrorResponse(`Cannot find the invoice ${req.params.id}`, 400));

  // success response
  res.status(200).json({ ok: true, data: { invoice } });
});

/* 
  @desc     Get upcoming invoices of the requested user - user can have multiple subcriptions in different locations
  @route    [GET] /api/v1/invoices/upcoming -self
  @route    [GET] /api/v1/invoices/upcoming?userId TODO:
  @route    [GET] /api/v1/invoices/userId/:userId/upcoming TODO:
  @route    [GET] /api/v1/subscription/:subscriptionId/invoices/upcoming TODO:
  @route    [GET] /api/v1/user/:userId/invoices/upcoming TODO:
  @access   Private
*/

exports.getUpcomingInvoices = asyncHandler(async (req, res, next) => {
  // query by user status
  const userId = req.userData.userId;
  const userRole = req.userData.role;

  // role permission chekck
  if (userRole === 'ADMIN') {
    return next(new ErrorResponse(`Haven't implemented query for specific user by id`, 404));
  }

  // $1: find user active subscriptions
  const subscriptions = await subscriptionService.findActiveSubscriptionsByUserId(userId);
  if (!subscriptions.length)
    return next(new ErrorResponse(`No usage reported at current period for user ${userId}`, 404));

  // $2: invoices
  const filter = { subscriptionId: { $in: subscriptions.map(subscription => subscription._id) } };
  const invoices = await Invoice.find(filter)
    .upComing()
    .byUser(userId, userRole)
    .lean();
  if (!invoices.length)
    return next(new ErrorResponse(`No usage reported at current period for user ${userId}`, 404));

  // // $3s: also confirm with stripe
  // const stripeSubscriptionIds = subscriptions.map(subscription => subscription.stripeId);
  // const stripe = await invoiceService.getStripeUpcomingInvoices(stripeSubscriptionIds);

  // success response
  res.status(200).json({ ok: true, data: { invoices } });
});
