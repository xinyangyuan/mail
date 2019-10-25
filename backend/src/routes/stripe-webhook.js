const express = require('express');

const controller = require('../controllers/stripe-webhook/stripe-webhook');
const stripeWebhookVerify = require('../middlewares/stripe-webhook-verify');

const router = express.Router();

/*
   Stipe Endpoint
*/

router.post('', stripeWebhookVerify, controller.handleStripeWebhookEvent);

module.exports = router;
