const express = require('express');

const controller = require('../controllers/stripe/stripe');
const stripeWebhookVerify = require('../middlewares/stripe-webhook-verify');

const router = express.Router();

/*
   Stipe Endpoints
*/

router.get('/pk', controller.getPublickKey);
router.post('/webhook', stripeWebhookVerify, controller.handleStripeWebhookEvent);

module.exports = router;
