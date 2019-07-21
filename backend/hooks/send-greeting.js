const mongoose = require('mongoose');

const crypto = require('../utils/encrypt');
const Mail = require('../models/mail');

//  Function: send greeting mail to newly signed-up user

const sendGreeting = async (req, res) => {
  console.log('hook is called');

  // prepare the mail contents
  const mail = new Mail({
    title: 'Hello: ' + req.fetchedUser.fullName + '!',
    description: 'Your first virtual mail is here!',
    content: 'Hope you have a great time using it!',
    senderId: mongoose.Types.ObjectId(req.fetchedUser._id),
    receiverId: mongoose.Types.ObjectId(req.fetchedUser._id),
    read_flag: false,
    star_flag: false,
    envelopKey: crypto.encrypt('hello.jpg'),
    contentPDFKey: crypto.encrypt('hello.pdf')
  });

  // async function to save mail into database
  await mail.save();
};

module.exports = sendGreeting;
