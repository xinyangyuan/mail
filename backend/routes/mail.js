const express = require('express');
const authVerify = require('../middlewares/auth-verify');
const senderVerify = require('../middlewares/sender-verify');
const MailController = require('../controllers/mail');

const router = express.Router();

/*
  authVerify to verify user status; senderVerify to verify sender status
*/

router.get('', authVerify, MailController.getMailList);
router.patch('/:id', authVerify, MailController.updateMail);
router.delete('/:id', authVerify, MailController.deleteMail); // CAUTION
router.post('/create', authVerify, senderVerify, MailController.createMail);

module.exports = router;
