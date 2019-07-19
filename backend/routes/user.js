const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

// user api routes
router.post('/signup', UserController.userSignUp);
router.post('/signin', UserController.userSignIn);
router.post('/confirmation/:emailToken', UserController.verifyConfirmation); // verify confirmation
//router.get('/confirmation/:id', UserController.sendConfirmation) // send a new email confimation

module.exports = router;
