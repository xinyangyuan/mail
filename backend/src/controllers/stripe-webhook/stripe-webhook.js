const asyncHandler = require('../../utils/async-handler');
const StripeEventHandler = require('./stripe-event-handler');
const ErrorResponse = require('../../utils/error-response');

/*
  Controller: handle all incoming stripe webhook events
*/

exports.handleStripeWebhookEvent = asyncHandler(async (req, res, next) => {
  // handle stripe webhook event
  const stripeEventHandler = new StripeEventHandler(req.stripeEvent);
  const { ok, message } = await stripeEventHandler.handle();

  // error response
  if (!ok) return next(new ErrorResponse(message, 400));

  // success response
  res.status(200).json({ ok, message });
});
