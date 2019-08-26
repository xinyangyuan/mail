const express = require('express');

const AuthMiddleware = require('../middlewares/auth-verify');
const queryCheck = require('../middlewares/query-check');
const updateVerify = require('../middlewares/update-verify');
const fileUpload = require('../middlewares/file-upload');
const emailTokenVerify = require('../middlewares/email-token-verify');

const MailController = require('../controllers/mail');

const router = express.Router();

/*
  authVerify to verify user status; senderVerify to verify sender status
*/

router.get('', AuthMiddleware.authVerify, queryCheck, MailController.getMailList);
router.get('/:id', AuthMiddleware.authVerify, MailController.getMail);
router.get('/:id/envelop', AuthMiddleware.authVerify, MailController.getEnvelop);
router.get('/:id/contentPDF', AuthMiddleware.authVerify, MailController.getContentPDF);

router.post('', AuthMiddleware.senderVerify, fileUpload, MailController.createMail);

router.put('/:id', AuthMiddleware.senderVerify, fileUpload, MailController.modifyMail);

router.patch('', AuthMiddleware.authVerify, queryCheck, updateVerify, MailController.updateMails);
router.patch('/:id', AuthMiddleware.authVerify, updateVerify, MailController.updateMail);
router.patch('/:id/:emailToken', emailTokenVerify, updateVerify, MailController.updateMail);

router.delete('', AuthMiddleware.authVerify, MailController.deleteMails);
router.delete('/:id', AuthMiddleware.authVerify, MailController.deleteMail);

module.exports = router;
