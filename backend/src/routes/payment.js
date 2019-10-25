const express = require('express');

const { protect, authorize } = require('../middlewares/auth');
const controller = require('../controllers/payment');
const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, controller.getPayments);
router.get('/:id', protect, controller.getPayment);

module.exports = router;
