const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/auth-verify');
const UserController = require('../controllers/user');

// user api routes
router.get('/self', AuthMiddleware.authVerify, UserController.getUser);

router.post('/signin', UserController.userSignIn);
router.post('/signup', UserController.userSignUp);
router.post('/signout', UserController.userSignOut);
router.post('/refresh_token', UserController.refreshToken);

router.get('/confirmation/:email', UserController.sendConfirmation);
router.post('/confirmation/:emailToken', UserController.verifyConfirmation);

router.get('/reset/:email', UserController.resetPassword);
router.post('/reset/:emailToken', UserController.verifyReset);

module.exports = router;
