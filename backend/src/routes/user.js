const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const UserController = require('../controllers/user');

/*
  Endpoints
*/

router.get('/self', protect, UserController.getSelf);

module.exports = router;
