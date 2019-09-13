const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const AddressController = require('../controllers/address');

const router = express.Router();

// Address api routes
router.get('', AddressController.getAddressList); // PUBLIC ACCESSIBLE
router.get('/:id', AddressController.getAddress); // PUBLIC ACCESSIBLE
router.get('/:id/vacantMailboxNos', AddressController.getVacantMailboxNos); // PUBLIC ACCESSIBLE
router.get('/:id/receivers', AuthMiddleware.senderVerify, AddressController.getAddressReceivers);

router.post('', AuthMiddleware.senderVerify, AddressController.createAddress);

// router.patch('/:id/receivers', AuthMiddleware.authVerify, AddressController.addReceiver);

module.exports = router;
