const mailgen = require('mailgen');

const SENDER_EMAIL = '"My Mail 📫" <sender@mail.com>';
const REPLY_TO_EMAIL = '';
const HOMPAGE_URL = 'http://localhost:4200';

/*
  Mailgen Configuration: set email theme and product information
*/

const mailGenerator = new mailgen({
  theme: 'default',

  product: {
    // Appears in header & footer of e-mails
    name: 'My Mail',
    link: HOMPAGE_URL,

    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'

    // Custom copyright notice
    copyright: 'Copyright © 2019 MyMail. All rights reserved.'
  }
});

/*
  Email template: confirmation email
*/

exports.generateConfirmationEmail = (name, email, emailToken, isSender) => {
  // token information
  const accountType = isSender ? 'sender' : 'user';
  const confimationURL = HOMPAGE_URL + `/confirmation/${accountType}/${emailToken}`;

  // prepare email html template
  const emailContent = {
    body: {
      name: name,
      intro: "Welcome to My Mail, we're very excited to have you on board!",
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
      outro: "Need help, or have questions? Just reply to this email, we'd love to help!"
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  return (emailTemplate = {
    from: SENDER_EMAIL,
    replyTo: REPLY_TO_EMAIL,
    to: email,
    subject: 'Hello ' + name,
    text: emailText,
    html: emailBody
  });
};

/*
  Email template: passwor reset email
*/

exports.generatePasswordResetEmail = (name, email, emailToken) => {
  // token information
  const confimationURL = HOMPAGE_URL + `/reset-password/${emailToken}`;

  // prepare email html template
  const emailContent = {
    body: {
      name: name,
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
      greeting: 'Hey',
      signature: 'Sincerely',
      outro:
        'If you did not request a password reset, no further action is required on your part. Hope you have a wonderful day!'
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  // email template
  return (emailTemplate = {
    from: SENDER_EMAIL,
    replyTo: REPLY_TO_EMAIL,
    to: email,
    subject: 'Password Reset',
    text: emailText,
    html: emailBody
  });
};

/*
  Email template: new mail received
*/

exports.generateMailReceivedEmail = (name, email, mailId, emailToken) => {
  //  // token information
  const scanURL = HOMPAGE_URL + `/update-mail/${mailId}/${emailToken.scan}#scan`;
  const skipScanURL = HOMPAGE_URL + `/update-mail/${mailId}/${emailToken.skipScan}#skip-scan`;

  // prepare email html template
  const emailContent = {
    body: {
      name: name,
      intro: 'We have just received a new mail for you!',
      action: [
        {
          instructions:
            '🧙 Click a magic button below to update your mail status (link is valid for 24-hour):',
          button: {
            color: '#64C4ED',
            text: 'SCAN MAIL',
            link: scanURL
          }
        },
        {
          button: {
            color: '#DC4D2F',
            text: 'SKIP SCAN',
            link: skipScanURL
          }
        }
      ],
      greeting: 'Hey',
      signature: 'Sincerely',
      outro: 'Hope you have a wonderful day!'
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  // email template
  return (emailTemplate = {
    from: SENDER_EMAIL,
    replyTo: REPLY_TO_EMAIL,
    to: email,
    subject: '[My Mail] You have received a new mail',
    text: emailText,
    html: emailBody
  });
};

/*
  Email template: new mail scanned
*/

exports.generateMailScannedEmail = (name, email) => {
  // prepare email html template
  const emailContent = {
    body: {
      greeting: 'Hey',
      name: name,
      intro: [
        'We have prepare the mail scan for you!',
        'Please check the scan in you attachment 📎'
      ],
      signature: 'Sincerely',
      outro: 'Hope you have an awesome day!'
    }
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  // email template
  return (emailTemplate = {
    from: SENDER_EMAIL,
    replyTo: REPLY_TO_EMAIL,
    to: email,
    subject: 'You mail has been scanned',
    text: emailText,
    html: emailBody
  });
};
