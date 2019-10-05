const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const InvoiceController = require('../controllers/invoice');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', AuthMiddleware.authVerify, InvoiceController.getInvoices);
router.get('/:id', AuthMiddleware.authVerify, InvoiceController.getInvoice);
