const express = require('express');

const UserController = require('../controllers/user');
const Email = require('../hooks/send-email');
const sendGreeting = require('../hooks/send-greeting');

const router = express.Router();

// user api routes
router.post('/signup', UserController.userSignUp, Email.signUpNotification, sendGreeting);
router.post('/signin', UserController.userSignIn);

router.get('/confirmation/:email', UserController.sendConfirmation, Email.emailConfirmation);
router.post('/confirmation/:emailToken', UserController.verifyConfirmation);

router.get('/reset/:email', UserController.resetPassword, Email.passwordReset);
router.post('/reset/:emailToken', UserController.verifyReset);

module.exports = router;
