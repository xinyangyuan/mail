var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;
if (process.env.NODE_ENV === 'development') {
  // ethereal.email
  mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS
    }
  };
} else {
  // sendgrid setup
  mailConfig = sgTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  });
}

// specify the method of mail delivery
const transporter = nodemailer.createTransport(mailConfig);

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Connected to email server'.cyan.bold);
  }
});

// export email transporter
module.exports = transporter;

/*
  const email = {
  from: 'awesome@bar.com',
  to: 'mr.walrus@foo.com',
  subject: 'Hello',
  text: 'Hello world',
  html: '<b>Hello world</b>'
  };

  transporter.sendMail(email, function(err, info) {
    if (err) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
*/
