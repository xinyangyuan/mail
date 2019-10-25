const mime = require('mime');
const transporter = require('../utils/nodemailer');

const tokenService = require('./token');
const emailTemplate = require('../utils/email-template');

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
  const token = tokenService.generateConfirmationToken(receiver);

  // email template
  const email = emailTemplate.generateConfirmationEmail(
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
  const token = tokenService.generatePasswordResetToken(receiver);

  // email template
  const email = emailTemplate.generatePasswordResetEmail(receiver.fullName, receiver.email, token);

  return send(email);
};

/*
  Mail received notification email:
*/

exports.mailReceivedNotification = (receiver, mail, file) => {
  // email token
  const scanToken = tokenService.generateScanToken(mail);
  const skipToken = tokenService.generateSkipScanToken(mail);
  const emailToken = { scan: scanToken, skipScan: skipToken };

  // email template
  const email = emailTemplate.generateMailReceivedEmail(
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
  const email = emailTemplate.generateMailScannedEmail(receiver.fullName, receiver.email);

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
