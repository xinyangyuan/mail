const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth-verify');
const PaymentController = require('../controllers/payment');

// payment api routes
router.get('', AuthMiddleware.authVerify, PaymentController.getPaymentList);
router.get('/:id', AuthMiddleware.authVerify, PaymentController.getPayment);

module.exports = router;
