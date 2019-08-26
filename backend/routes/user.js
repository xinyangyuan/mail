const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

// user api routes
router.post('/signup', UserController.userSignUp);
router.post('/signin', UserController.userSignIn);

router.get('/confirmation/:email', UserController.sendConfirmation);
router.post('/confirmation/:emailToken', UserController.verifyConfirmation);

router.get('/reset/:email', UserController.resetPassword);
router.post('/reset/:emailToken', UserController.verifyReset);

module.exports = router;
