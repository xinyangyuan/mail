const mailgen = require('mailgen');

/*
  Mailgen Configuration: set email theme and product information
*/

const mailGenerator = new mailgen({
  theme: 'default',

  product: {
    // Appears in header & footer of e-mails
    name: 'My Mail',
    link: 'http://localhost:4200',

    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'

    // Custom copyright notice
    copyright: 'Copyright © 2019 MyMail. All rights reserved.'
  }
});

// Template: email address confirmation
const generateVerifyEmail = (req, emailToken) => {
  // token information
  const accountType = req.body.isSender ? 'sender' : 'user';
  const confimationURL = `http://localhost:4200/confirmation/${accountType}/${emailToken}`;

  // prepare email html template
  const email = {
    body: {
      name: req.body.firstName + ' ' + req.body.lastName,
      intro: "Welcome to My Mail! We're very excited to have you on board.",
      action: {
        instructions: 'To get started with MyMail, please click here:',
        button: {
          color: '#22BC66', // Optional action button color
          text: 'Confirm your account',
          link: confimationURL
        }
      },
      //greeting: 'Dear',
      signature: 'Sincerely',
      outro: "Need help, or have questions? Just reply to this email, we'd love to help."
    }
  };

  const emailBody = mailGenerator.generate(email);
  const emailText = mailGenerator.generatePlaintext(email);

  // email template
  return (emailTemplate = {
    from: 'awesome@bar.com',
    to: req.body.email,
    subject: 'Hello ' + req.body.firstName + ' ' + req.body.lastName,
    text: emailText,
    html: emailBody
  });
};

// Template: password reset
const generatePasswordResetEmail = (req, emailToken) => {
  // token information
  const confimationURL = `http://localhost:4200/reset-password/${emailToken}`;

  // prepare email html template
  const email = {
    body: {
      name: req.body.firstName + ' ' + req.body.lastName,
      intro:
        'You have received this email because a password reset request for your account was received.',
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
          color: '#DC4D2F', // Optional action button color
          text: 'Reset your password',
          link: confimationURL
        }
      },
      //greeting: 'Dear',
      signature: 'Sincerely',
      outro: 'If you did not request a password reset, no further action is required on your part.'
    }
  };

  const emailBody = mailGenerator.generate(email);
  const emailText = mailGenerator.generatePlaintext(email);

  // email template
  return (emailTemplate = {
    from: 'awesome@bar.com',
    to: req.body.email,
    subject: 'Hello ' + req.body.firstName + ' ' + req.body.lastName,
    text: emailText,
    html: emailBody
  });
};

module.exports = { mailGenerator, generateVerifyEmail, generatePasswordResetEmail };
