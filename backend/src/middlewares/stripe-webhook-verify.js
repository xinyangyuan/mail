const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeWebhookVerify = (req, res, next) => {
  try {
    // signature and secret
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // signed body
    req.stripeEvent = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = stripeWebhookVerify;
