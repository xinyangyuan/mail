const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

// user api routes
router.post('/signup', UserController.userSignUp);
router.post('/signin', UserController.userSignIn);

module.exports = router;
