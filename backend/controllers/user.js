const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');
const Mail = require('../models/mail'); // used to send gretting mail to new user
const crypto = require('../utils/encrypt');
const transporter = require('../utils/nodemailer');
const mailGenerator = require('../utils/mailgen');

/*
  Helper Function: Go-lang style async wrapper
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Helper Function: send greeting mail to newly signed-up user
*/
const sendGreeting = async fetchedUser => {
  // prepare the mail contents
  const mail = new Mail({
    title: 'Hello: ' + fetchedUser.fullName + '!',
    description: 'Your first virtual mail is here!',
    content: 'Hope you have a great time using it!',
    senderId: mongoose.Types.ObjectId(fetchedUser._id),
    receiverId: mongoose.Types.ObjectId(fetchedUser._id),
    read_flag: false,
    star_flag: false,
    envelopKey: crypto.encrypt('hello.jpg'),
    contentPDFKey: crypto.encrypt('hello.pdf')
  });

  // async function to save mail into database
  await mail.save();
};

/*
  Helper Function: generate verification email template
*/
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

/*
  Function: signup
*/

exports.userSignUp = async (req, res) => {
  // async funtion: generate hash, hash(plainPassword, saltRounds)
  // saltRounds really mean cost factor, pick the cost according to the server setup
  // https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993
  const hash = await bcrypt.hash(req.body.password, 10); // bcrpt error is NOT HANDELED

  // async function: create the user in database
  const user = new User({
    name: { first: req.body.firstName, last: req.body.lastName },
    email: req.body.email,
    password: hash,
    isSender: req.body.isSender,
    isConfirmed: false
  });
  const { error, data: fetchedUser } = await async_wrapper(user.save());

  if (error || !fetchedUser) {
    // 500 or 401
    return res.status(401).json({ message: 'Your email is already registered!' });
  }

  // send a gretting email to the user
  await sendGreeting(fetchedUser);

  // generate email verifcation link
  const payload = {
    userId: fetchedUser._id
  };
  const emailToken = jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });

  // send email verification to user
  const email = generateVerifyEmail(req, emailToken);
  transporter.sendMail(email, (err, info) => {
    if (err) {
      console.log(err);
      res.status(201).json({ message: 'Failed to send email verification!' });
    } else {
      console.log('Message sent: ' + info.response); // TODO
      res.status(201).json({ message: 'Message sent:' + info.response });
    }
  });
};

/*
  Function: sign-in
*/

exports.userSignIn = async (req, res) => {
  console.log('userSignIn is called');
  // async funtion: find user with matched email in db
  const { error, data: fetchedUser } = await async_wrapper(User.findOne({ email: req.body.email }));

  if (error || !fetchedUser) {
    return res.status(401).json({
      message: 'Email is not associated to a user.'
    });
  }

  if (!fetchedUser.isConfirmed) {
    return res.status(401).json({
      message: 'Please verify your email address!'
    });
  }

  // async func: check user credentials
  const result = await bcrypt.compare(req.body.password, fetchedUser.password); // bcrpt error is NOT HANDELED
  if (!result) {
    return res.status(401).json({
      message: 'Wrong user password entered.'
    });
  }

  // send the response to frontend
  const payload = {
    email: fetchedUser.email,
    userId: fetchedUser._id,
    accountType: fetchedUser.isSender ? 'sender' : 'user'
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

  res.status(200).json({
    token: token,
    expiresDuration: 3600, // unit: second
    userId: fetchedUser._id,
    isSender: fetchedUser.isSender
  });
};

/*
  Function: confirm registered user email
*/
exports.verifyConfirmation = async (req, res) => {
  try {
    console.log('verifyConfirmation is called');
    // get email token from param
    const emailToken = req.params.emailToken;

    // synchronous func: will throw error if token is not verified
    const decodedEmailToken = jwt.verify(emailToken, process.env.EMAIL_JWT_KEY);

    // async funtion: find user by ID in db
    const { error, data: fetchedUser } = await async_wrapper(
      User.findById(decodedEmailToken.userId)
    );
    if (error || !fetchedUser) {
      return res.status(401).json({
        message: 'Failed to find your account.'
      });
    }

    // async func: check user credentials
    const result = await bcrypt.compare(req.body.password, fetchedUser.password); // bcrpt error is NOT HANDELED
    if (!result) {
      return res.status(401).json({
        message: 'Wrong user password entered.'
      });
    }

    // update the user confirmation status
    const update = {
      $set: { isConfirmed: true }
    };
    const { err, data: updatedUser } = await async_wrapper(
      User.findOneAndUpdate({ _id: decodedEmailToken.userId }, update)
    );
    if (err || !updatedUser) {
      return res.status(401).json({
        message: 'Failed to update your account status.'
      });
    }

    // finally send the response to frontend
    const payload = {
      email: updatedUser.email,
      userId: updatedUser._id,
      accountType: updatedUser.isSender ? 'sender' : 'user'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

    res.status(200).json({
      token: token,
      expiresDuration: 3600, // unit: second
      userId: updatedUser._id,
      isSender: updatedUser.isSender
    });
  } catch {
    console.log('error occured');
    return res.status(401).json({
      message: 'Invalid user password entered.'
    });
  }
};
