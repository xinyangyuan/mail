const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const AddressController = require('../controllers/address');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', AddressController.getAddressList); // PUBLIC ACCESSIBLE

router.get(
  '/senderId/:senderId',
  AuthMiddleware.authVerify,
  AddressController.getAddressBySenderId
);

router.get(
  '/receivers/receiverId/:receiverId',
  AuthMiddleware.authVerify,
  AddressController.getAddressByReceiverId
);

router.get('/:id', AddressController.getAddress); // PUBLIC ACCESSIBLE

router.get('/:id/vacantMailboxNos', AddressController.getVacantMailboxNos); // PUBLIC ACCESSIBLE

router.get('/:id/receivers', AuthMiddleware.senderVerify, AddressController.getAddressReceivers);

/*
   [PATCH] Endpoints
*/

// router.patch('/:id/receivers', AuthMiddleware.authVerify, AddressController.addReceiver);

/*
   [POST] Endpoint
*/

router.post('', AuthMiddleware.senderVerify, AddressController.createAddress);

/*
   Module
*/

module.exports = router;
