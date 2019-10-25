const express = require('express');

const { protect } = require('../middlewares/auth');
const controller = require('../controllers/invoice');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, controller.getInvoices);
router.get('/:id', protect, controller.getInvoice);
