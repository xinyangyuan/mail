const mailgen = require('mailgen');

// Configure mailgen by setting a theme and your product information
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

module.exports = mailGenerator;
