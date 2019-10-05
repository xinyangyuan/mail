const stripe = require('stripe')(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_KEY; // webhook secret

const stripeWebhookVerify = (req, res, next) => {
  // dev environment: unsigned webhook
  if (process.env.NODE_ENV === 'development') {
    req.stripeEvent = req.body;
    return next();
  }

  // prod environment: signed webhook
  try {
    const signature = request.headers['stripe-signature'];
    req.stripeEvent = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    next();
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
// response.json({ received: true });

module.exports = stripeWebhookVerify;
