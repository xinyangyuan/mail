const express = require('express');

const query = require('../middlewares/query');
const { protect, authorize } = require('../middlewares/auth');
const controller = require('../controllers/payment');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, query, controller.getPayments);
router.get('/:id', protect, controller.getPayment);

module.exports = router;
