const express = require('express');

const query = require('../middlewares/query');
const { protect } = require('../middlewares/auth');
const controller = require('../controllers/invoice');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, query, controller.getInvoices);
router.get('/upcoming', protect, controller.getUpcomingInvoices);
router.get('/:id', protect, controller.getInvoice);

module.exports = router;
