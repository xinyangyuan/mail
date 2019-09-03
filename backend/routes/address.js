const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const AddressController = require('../controllers/address');

const router = express.Router();

// Address api routes
router.get('/info', AuthMiddleware.senderVerify, AddressController.getAddressInfo);
router.patch('/addReceiver', AuthMiddleware.authVerify, AddressController.addReceiver);

router.get('', AddressController.getAddressList); // PUBLIC ACCESSIBLE
router.get('/:id', AddressController.getAddress); // PUBLIC ACCESSIBLE
// router.get('/:id/info', AuthMiddleware.senderVerify, AddressController.getAddressInfo);

router.post('', AuthMiddleware.senderVerify, AddressController.createAddress);
// router.post('/:id/receivers/:receiverId', AuthMiddleware.authVerify, AddressController.addReceiver);

module.exports = router;
