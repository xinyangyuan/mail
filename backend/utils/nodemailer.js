var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

// sendgrid setup
var options = {
  auth: {
    //api_user: 'SENDGRID_USERNAME',
    api_key: process.env.SENDGRID_KEY
  }
};

// specify the method of mail delivery
const transporter = nodemailer.createTransport(sgTransport(options));

// const email = {
// from: 'awesome@bar.com',
// to: 'mr.walrus@foo.com',
// subject: 'Hello',
// text: 'Hello world',
// html: '<b>Hello world</b>'
// };

// transporter.sendMail(email, function(err, info) {
//   if (err) {
//     console.log(error);
//   } else {
//     console.log('Message sent: ' + info.response);
//   }
// });

// export email transporter
module.exports = transporter;
