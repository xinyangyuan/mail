const express = require('express');
const AuthValidator = require('../middlewares/validators/auth');
const AuthController = require('../controllers/auth');
const router = express.Router();

/*
  Endpoints [NON-REST-ROUTES]
*/

router.post('/signin', AuthValidator.signIn, AuthController.signIn);
router.post('/signup', AuthValidator.signUp, AuthController.signUp);
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
