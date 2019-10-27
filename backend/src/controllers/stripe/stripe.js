const asyncHandler = require('../../utils/async-handler');
const StripeEventHandler = require('./stripe-event-handler');
const ErrorResponse = require('../../utils/error-response');

/* 
  @desc     Get stripe publick keey
  @route    [GET] /api/v1/stripe/pk
  @access   Public
*/

exports.getPublickKey = (req, res) => {
  const pk = process.env.STRIPE_PUB_KEY;
  return res.status(200).json({ ok: true, data: { pk } });
};

/* 
  @desc     Handle all incoming stripe webhook events
  @route    [POST] /api/v1/stripe/webhook
  @access   Private/Verify-By-Stripe-Signature
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
