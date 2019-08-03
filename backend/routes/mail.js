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
router.get('/:id/envelop', authVerify, MailController.getEnvelop);
router.get('/:id/contentPDF', authVerify, MailController.getContentPDF);

router.post('', authVerify, senderVerify, fileUpload, s3Upload, MailController.createMail);

router.patch('', authVerify, MailController.updateMails); // Only can modify flags
router.patch('/:id', authVerify, MailController.updateMail); // Only can modify flags

router.delete('', authVerify, MailController.deleteMails);
router.delete('/:id', authVerify, MailController.deleteMail);

module.exports = router;
