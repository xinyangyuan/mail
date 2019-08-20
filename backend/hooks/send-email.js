const mime = require('mime');

const transporter = require('../utils/nodemailer');
const EmailTemplate = require('../utils/email-template');

/*
  Helper: send  email
*/

const sendEmail = email => {
  transporter.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
};

/*
  Hook: send sign up email
*/

exports.signUpNotification = (req, res) => {
  const email = EmailTemplate.generateConfirmationEmail(
    req.emailData.name,
    req.emailData.email,
    req.emailData.emailToken,
    req.fetchedUser.isSender
  );

  transporter.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to send email verification!' });
    } else {
      console.log('Message sent: ' + info.response);
      res.status(201).json({ message: 'Message sent:' + info.response });
    }
  });
};

/*
  Hook: (re)send email confirmation
*/

exports.emailConfirmation = (req, res) => {
  const email = EmailTemplate.generateConfirmationEmail(
    req.emailData.name,
    req.emailData.email,
    req.emailData.emailToken,
    req.fetchedUser.isSender
  );

  transporter.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to send email verification!' });
    } else {
      console.log('Message sent: ' + info.response);
      res.status(201).json({ message: 'Email sent successfully' });
    }
  });
};

/*
  Hook: send reset password email
*/

exports.passwordReset = (req, res) => {
  const email = EmailTemplate.generatePasswordResetEmail(
    req.emailData.name,
    req.emailData.email,
    req.emailData.emailToken
  );

  transporter.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to send password reset email!' });
    } else {
      console.log('Message sent: ' + info.response);
      res.status(201).json({ message: 'Password reset email sent successfully' });
    }
  });
};

/*
  Hook: email with envelop image attached
*/

exports.mailReceivedNotification = req => {
  const email = EmailTemplate.generateMailReceivedEmail(
    req.emailData.name,
    req.emailData.email,
    req.emailData.id,
    req.emailData.emailToken
  );

  email.attachments = [
    {
      filename:
        req.files.envelop[0].fieldname + '.' + mime.getExtension(req.files.envelop[0].mimetype),
      content: req.files.envelop[0].buffer, // 7bit encoded buffer
      contentType: req.files.envelop[0].mimetype
    }
  ];

  sendEmail(email);
};

/*
  Hook: email with scanned mail attached
*/

exports.mailScannedNotification = req => {
  const email = EmailTemplate.generateMailScannedEmail(req.emailData.name, req.emailData.email);

  email.attachments = [
    {
      filename:
        req.files.contentPDF[0].fieldname +
        '.' +
        mime.getExtension(req.files.contentPDF[0].mimetype),
      content: req.files.contentPDF[0].buffer, // 7bit encoded buffer
      contentType: req.files.contentPDF[0].mimetype
    }
  ];

  sendEmail(email);
};
