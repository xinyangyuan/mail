const express = require('express');
const rateLimit = require('express-rate-limit');

const AuthValidator = require('../middlewares/validators/auth');
const AuthController = require('../controllers/auth');
const router = express.Router();

/*
  Rate Limit
*/

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 6000, // 6 hour window
  max: 5, // start blocking after 5 requests
  message: 'Too many accounts created from this IP'
});

/*
  Endpoints [NON-REST-ROUTES]
*/

router.post('/signin', AuthValidator.signIn, AuthController.signIn);
router.post('/signup', createAccountLimiter, AuthValidator.signUp, AuthController.signUp);
router.post('/signout', AuthController.signOut);
router.post('/refresh_token', AuthController.refreshToken);

router.post('/forgot_password', AuthValidator.forgotPassword, AuthController.forgotPassword);
router.post('/reset_password', AuthValidator.resetPassword, AuthController.resetPassword);

router.post(
  '/send_email_verficication',
  AuthValidator.sendEmailVerification,
  AuthController.sendEmailVerification
);
router.post(
  '/confirm_email_verficication',
  AuthValidator.confirmEmailVerification,
  AuthController.confirmEmailVerification
);

module.exports = router;
