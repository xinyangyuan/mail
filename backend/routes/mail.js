const express = require('express');

const authVerify = require('../middlewares/auth-verify');
const senderVerify = require('../middlewares/sender-verify');
const fileUpload = require('../middlewares/file-upload');
const s3Upload = require('../middlewares/s3-upload');
const MailController = require('../controllers/mail');

const router = express.Router();
/*
  authVerify to verify user status; senderVerify to verify sender status
*/

router.get('', authVerify, MailController.getMailList);
router.post('', authVerify, senderVerify, fileUpload, s3Upload, MailController.createMail);
router.patch('/:id', authVerify, MailController.updateMail); // Only can modify flags
router.delete('/:id', authVerify, MailController.deleteMail); // CAUTION
router.get('/envelop/:id', authVerify, MailController.getEnvelop);
router.get('/contentPDF/:id', authVerify, MailController.getContentPDF);

module.exports = router;
