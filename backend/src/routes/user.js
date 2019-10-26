const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const UserController = require('../controllers/user');

/*
  Endpoints
*/

router.get('/self', protect, UserController.getSelf);

// @route    [GET] /api/v1/user/:userId/mail
// @route    [GET] /api/v1/user/:userId/address
// @route    [GET] /api/v1/user/:userId/subscription
// @route    [GET] /api/v1/user/:userId/invoice
// @route    [GET] /api/v1/user/:userId/invoice/upcoming

module.exports = router;
