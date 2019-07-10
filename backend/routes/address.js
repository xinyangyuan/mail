const express = require('express');
const authVerify = require('../middlewares/auth-verify');
const senderVerify = require('../middlewares/sender-verify');
const AddressController = require('../controllers/address');

const router = express.Router();

// user api routes
router.get('', authVerify, AddressController.getAddress); // can contain querry: receiverId
router.get('/info', authVerify, senderVerify, AddressController.getAddressInfo);
router.get('/list', AddressController.getAddressList); // PUBLIC ACCESSIBLE
router.post('/new', authVerify, senderVerify, AddressController.createAddress); // contains querry: receiverId
router.patch('/addReceiver', authVerify, AddressController.addReceiver);

module.exports = router;
