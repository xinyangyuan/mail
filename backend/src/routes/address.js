const express = require('express');

const query = require('../middlewares/query');
const { protect, authorize } = require('../middlewares/auth');
const controller = require('../controllers/address');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', query, controller.getAddresses);

router.get('/:id', controller.getAddress);

router.get(
  '/senderId/:senderId',
  protect,
  authorize('ADMIN', 'SENDER'),
  controller.getAddressBySenderId
);

router.get(
  '/receivers/receiverId/:receiverId',
  protect,
  authorize('ADMIN', 'USER'),
  controller.getAddressByReceiverId
);

router.get('/:id/vacant_mailboxes', controller.getVacantMailboxNos);

router.get('/:id/receivers', protect, authorize('ADMIN', 'SENDER'), controller.getAddressReceivers);

/*
   [PATCH] Endpoints
*/

router.patch('/:id', protect, authorize('SENDER', 'ADMIN'), controller.updateAddress);

/*
   [POST] Endpoint
*/

router.post('', protect, authorize('SENDER', 'ADMIN'), controller.createAddress);
router.post('/:id/receivers', protect, authorize('ADMIN'), controller.addReceiver);

/*
   [DELETE] Endpoints
*/

router.delete('/:id/receivers/:receiverId', protect, authorize('ADMIN'), controller.removeReceiver);

/*
   Module
*/

module.exports = router;
