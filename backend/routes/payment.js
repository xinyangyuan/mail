const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth-verify');
const PaymentController = require('../controllers/payment');

// payment api routes
router.get('', AuthMiddleware.authVerify, queryCheck, MailController.getMailList);

router.get('', AuthMiddleware.authVerify, PaymentController.getPaymentList);
router.get('/:id', AuthMiddleware.authVerify, PaymentController.getPayment);

router.post('', PaymentController.createPayment); // PUBLIC ACCESSIBLE

module.exports = router;
