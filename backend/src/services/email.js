const mime = require('mime');
const transporter = require('../utils/nodemailer');

const Token = require('./token');
const EmailTemplate = require('../utils/email-template');

/*
  Send email:
*/

const send = email => {
  return transporter
    .sendMail(email)
    .then(info => console.log('Message sent: ' + info.response))
    .catch(err => {
      console.log(err);
      throw Error;
    });
};
exports.send = send;

/*
  (Re)send email confirmation
*/

exports.emailConfirmation = receiver => {
  // token
  const token = Token.generateConfirmationToken(receiver);

  // email template
  const email = EmailTemplate.generateConfirmationEmail(
    receiver.fullName,
    receiver.email,
    token,
    receiver.isSender
  );

  return send(email);
};

/*
  Reset password email
*/

exports.passwordReset = receiver => {
  // token
  const token = Token.generatePasswordResetToken(receiver);

  // email template
  const email = EmailTemplate.generatePasswordResetEmail(receiver.fullName, receiver.email, token);

  return send(email);
};

/*
  Mail received notification email:
*/

exports.mailReceivedNotification = (receiver, mail, file) => {
  // email token
  const scanToken = Token.generateScanToken(mail);
  const skipToken = Token.generateSkipScanToken(mail);
  const emailToken = { scan: scanToken, skipScan: skipToken };

  // email template
  const email = EmailTemplate.generateMailReceivedEmail(
    receiver.fullName,
    receiver.email,
    mail._id,
    emailToken
  );

  // attatchment file
  email.attachments = [
    {
      filename: file.fieldname + '.' + mime.getExtension(file.mimetype),
      content: file.buffer, // 7bit encoded buffer
      contentType: file.mimetype
    }
  ];

  return send(email);
};

/*
  Mail scanned email:
*/

exports.mailScannedNotification = (receiver, file) => {
  // email template
  const email = EmailTemplate.generateMailScannedEmail(receiver.fullName, receiver.email);

  // attatchment file
  email.attachments = [
    {
      filename: file.fieldname + '.' + mime.getExtension(file.mimetype),
      content: file.buffer, // 7bit encoded buffer
      contentType: file.mimetype
    }
  ];

  return send(email);
};
