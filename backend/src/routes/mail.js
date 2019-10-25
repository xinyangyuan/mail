const express = require('express');

const queryCheck = require('../middlewares/query-check');
const updateVerify = require('../middlewares/update-verify');
const fileUpload = require('../middlewares/file-upload');
const emailTokenVerify = require('../middlewares/email-token-verify');

const { protect, authorize } = require('../middlewares/auth');
const controller = require('../controllers/mail');

const router = express.Router();

/*
   [GET] Endpoints
*/

router.get('', protect, queryCheck, controller.getMails);
// router.get('/senderId/:senderId', AuthMiddleware.minSecurityLevel())
// router.get('/receiverId/:receiverId', AuthMiddleware.minSecurityLevel())
router.get('/:id', protect, controller.getMail);
router.get('/:id/envelop', protect, controller.getEnvelop);
router.get('/:id/contentPDF', protect, controller.getContentPDF);

/*
   [PATCH] Endpoints
*/

router.patch('', protect, queryCheck, updateVerify, controller.updateMails);
router.patch('/:id', protect, updateVerify, controller.updateMail);
router.patch('/:id/:emailToken', emailTokenVerify, updateVerify, controller.updateMail);

/*
   [POST] Endpoints
*/

router.post('', protect, authorize('SENDER', 'ADMIN'), fileUpload, controller.createMail);

/*
   [PUT] Endpoints
*/

router.put('/:id', protect, authorize('SENDER', 'ADMIN'), fileUpload, controller.modifyMail);

/*
   [DEL] Endpoints
*/

router.delete('', protect, controller.deleteMails);
router.delete('/:id', protect, controller.deleteMail);

module.exports = router;
