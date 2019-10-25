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

  // filter, projection
  const filter = { _id: req.params.id };

  // $1: invoices
  const invoices = await Invoice.find(filter)
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
