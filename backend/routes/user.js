const express = require('express');

const sendGreeting = require('../hooks/send-greeting');
const UserController = require('../controllers/user');

const router = express.Router();

// user api routes
router.post('/signup', UserController.userSignUp, sendGreeting);
router.post('/signin', UserController.userSignIn);

router.get('/confirmation/:email', UserController.sendConfirmation);
router.post('/confirmation/:emailToken', UserController.verifyConfirmation);

router.get('/reset/:email', UserController.resetPassword);
router.post('/reset/:emailToken', UserController.verifyReset);

module.exports = router;
