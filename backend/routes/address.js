const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const AddressController = require('../controllers/address');
const updateUserAddress = require('../hooks/update-user-address');

const router = express.Router();

// Address api routes
router.get('/info', AuthMiddleware.authVerify, AuthMiddleware.senderVerify, AddressController.getAddressInfo);
router.patch('/addReceiver', AuthMiddleware.authVerify, AddressController.addReceiver, updateUserAddress);

router.get('', AddressController.getAddressList); // PUBLIC ACCESSIBLE
router.get('/:id', AddressController.getAddress); // PUBLIC ACCESSIBLE

router.post('', AuthMiddleware.authVerify, AuthMiddleware.senderVerify, AddressController.createAddress, updateUserAddress);
// router.patch('/:id', AuthMiddleware.authVerify, senderVerify, AddressController.updateAddress);

module.exports = router;
