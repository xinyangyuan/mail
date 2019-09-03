const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const SubscriptionController = require('../controllers/subscription');

const router = express.Router();

// Subscription api routes
router.get('', AuthMiddleware.authVerify, SubscriptionController.getSubscriptionList);
router.get('/:id', AuthMiddleware.authVerify, SubscriptionController.getSubscription);

router.post('', AuthMiddleware.authVerify, SubscriptionController.createSubscription);

router.patch('', AuthMiddleware.authVerify, SubscriptionController.getSubscription); // AUTO-RENEW, OVERAGE

router.delete('', AuthMiddleware.authVerify, SubscriptionController.getSubscription); // CANCEL

module.exports = router;
