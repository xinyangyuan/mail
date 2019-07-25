const express = require('express');

const authVerify = require('../middlewares/auth-verify');
const senderVerify = require('../middlewares/sender-verify');
const updateUserAddress = require('../hooks/update-user-address');
const AddressController = require('../controllers/address');

const router = express.Router();

// Address api routes
router.get('/info', authVerify, senderVerify, AddressController.getAddressInfo);
router.patch('/addReceiver', authVerify, AddressController.addReceiver, updateUserAddress);

router.get('', AddressController.getAddressList); // PUBLIC ACCESSIBLE
router.get('/:id', AddressController.getAddress); // PUBLIC ACCESSIBLE
router.post('', authVerify, senderVerify, AddressController.createAddress, updateUserAddress);
// router.patch('/:id', authVerify, senderVerify, AddressController.updateAddress);

module.exports = router;
