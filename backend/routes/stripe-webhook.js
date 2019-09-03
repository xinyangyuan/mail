const express = require('express');

const stripeWebhookVerify = require('../middlewares/stripe-webhook-verify');
const StripeWehookController = require('../controllers/stripe-webhook');

const router = express.Router();

// stripe-webhook route
router.post('', stripeWebhookVerify, StripeWehookController.eventHandler);

module.exports = router;
