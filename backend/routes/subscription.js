const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const SubscriptionController = require('../controllers/subscription');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', AuthMiddleware.authVerify, SubscriptionController.getSubscriptionList);
router.get('/:id', AuthMiddleware.authVerify, SubscriptionController.getSubscription);

/*
   [PATCH] Endpoint
*/

router.patch('/:id', AuthMiddleware.authVerify, SubscriptionController.updateSubscription);

/*
   [POST] Endpoint
*/

router.post('', AuthMiddleware.authVerify, SubscriptionController.createSubscription);

/*
   [DEL] Endpoint
*/

router.delete('', AuthMiddleware.authVerify, SubscriptionController.getSubscription); // CANCEL

module.exports = router;
