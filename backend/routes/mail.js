const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const queryCheck = require('../middlewares/query-check');
const updateVerify = require('../middlewares/update-verify')
const fileUpload = require('../middlewares/file-upload');
const s3Upload = require('../middlewares/s3-upload');
const MailController = require('../controllers/mail');

const router = express.Router();
/*
  authVerify to verify user status; senderVerify to verify sender status
*/

router.get('', AuthMiddleware.authVerify, queryCheck, MailController.getMailList);
router.get('/:id/envelop', AuthMiddleware.authVerify, MailController.getEnvelop);
router.get('/:id/contentPDF', AuthMiddleware.authVerify, MailController.getContentPDF);

router.post('', AuthMiddleware.authVerify, AuthMiddleware.senderVerify, fileUpload, s3Upload, MailController.createMail);

router.put('/:id', AuthMiddleware.authVerify, AuthMiddleware.senderVerify, fileUpload, s3Upload, MailController.modifyMail);

router.patch('', AuthMiddleware.authVerify, queryCheck, updateVerify, MailController.updateMails); // can moddify flags || status
router.patch('/:id', AuthMiddleware.authVerify, updateVerify, MailController.updateMail); // can moddify flags || status

router.delete('', AuthMiddleware.authVerify, MailController.deleteMails);
router.delete('/:id', AuthMiddleware.authVerify, MailController.deleteMail);

module.exports = router;
