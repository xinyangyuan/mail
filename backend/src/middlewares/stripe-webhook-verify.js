const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeWebhookVerify = (req, res, next) => {
  try {
    // signature and secret
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // signed body
    req.stripeEvent = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    next();
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
module.exports = stripeWebhookVerify;
