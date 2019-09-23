const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const crypto = require('../utils/encrypt');

const User = require('../models/user');
const Mail = require('../models/mail');

const Token = require('../services/token');
const Email = require('../services/email');

/*
  Function: get user
*/

exports.getUser = async (req, res) => {
  console.log('getUser is called');
  try {
    // $1: find user
    const user = await User.findById(req.userData.userId);

    // success response
    res.status(200).json({
      ok: true,
      user: {
        name: user.name,
        email: user.email,
        isSender: user.isSender
      }
    });
  } catch {
    // error response
    res.status(500).json({ ok: false, message: 'Unable to find user' });
  }
};

/*
  Function: sign-up
*/

exports.userSignUp = async (req, res) => {
  console.log('userSignUp is called');
  // validation
  if (!req.body.firstName)
    return res.status(401).json({ message: 'Please provide user firstName' });
  if (!req.body.lastName) return res.status(401).json({ message: 'Please provide user lastName' });
  if (!req.body.email) return res.status(401).json({ message: 'Please provide user email' });
  if (!req.body.password) return res.status(401).json({ message: 'Please provide user password' });

  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // options
    const options = { session: session };

    // $1: bcrypt
    // saltRounds really mean cost factor, pick the cost according to the server setup
    // https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993
    const hash = await bcrypt.hash(req.body.password, 10);

    // $2: create user
    const user_ = new User({
      name: { first: req.body.firstName, last: req.body.lastName },
      email: req.body.email,
      password: hash,
      isSender: req.body.isSender,
      isConfirmed: false
    });
    const user = await user_.save(options);

    // $3: send gretting mail
    const mail = new Mail({
      title: 'Hello: ' + user.fullName + '!',
      description: 'Your first virtual mail is here!',
      content: 'Hope you have a great time using it!',
      senderId: mongoose.Types.ObjectId(user._id),
      receiverId: mongoose.Types.ObjectId(user._id),
      status: 'SCANNED_ARCHIVED',
      envelopKey: crypto.encrypt('hello.jpg'),
      contentPDFKey: crypto.encrypt('hello.pdf')
    });
    await mail.save(options);

    // $4: email
    Email.emailConfirmation(user);

    // complete transaction and closes session
    await session.commitTransaction();
    session.endSession();

    // success response:
    res.status(201).json({ ok: true, message: 'New user is created' });
  } catch (error) {
    // closes transaction and session
    await session.abortTransaction();
    session.endSession();

    // error response
    if (error.name === 'ValidatorError') {
      res.status(401).json({ message: 'Email is already registered' });
    } else {
      res.status(500).json({ message: 'Unable to create new user' });
    }
  }
};

/*
  Function: sign-in
*/

exports.userSignIn = async (req, res) => {
  console.log('userSignIn is called');
  try {
    // filter
    const filter = { email: req.body.email };

    // $1: find user
    const user = await User.findOne(filter);
    if (!user) {
      return res.status(400).json({ message: 'Email is not associated with a user' });
    } else if (!user.isConfirmed) {
      return res.status(400).json({ message: 'Please verify your email address' });
    }

    // $2: check user credentials
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(401).json({ message: 'Wrong user password entered' });

    // tokens
    const token = Token.generateAuthToken(user);
    const refreshToken = Token.generateRefreshToken(user);

    // success response
    res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
    res.status(200).json({
      ok: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        isSender: user.isSender
      }
    });
  } catch {
    // error response
    res.status(500).json({ message: 'Unable to sign in the user' });
  }
};

/*
  Function: refresh token
*/

exports.refreshToken = async (req, res) => {
  console.log('refreshToken is called');
  try {
    // refreshToken
    let refreshToken = req.cookies.jid;
    if (!refreshToken) throw Error('Invalid session.');

    // verify token
    const payload = Token.verifyRefreshToken(refreshToken);

    // $1: find user
    const user = await User.findById(payload.userId);
    if (!user) throw Error('Unable to find user.');

    // new tokens
    const token = Token.generateAuthToken(user);
    refreshToken = Token.generateRefreshToken(user);

    // success response
    res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
    res.status(200).json({ ok: true, token });
  } catch (error) {
    // error response
    res.json({ ok: false, message: error });
  }
};

/*
  Function: sign-out
*/

exports.userSignOut = async (req, res) => {
  console.log('userSignOut is called');
  try {
    // success response
    res.cookie('jid', '', { httpOnly: true }); // path: '/refresh_token'
    res.status(200).json({ ok: true });
  } catch {
    // error response
    res.status(500).json({ message: 'Unable to sign out the user' });
  }
};

/*
  Function: (re)-send email verification
*/

exports.sendConfirmation = async (req, res) => {
  console.log('sendConfirmation is called');
  try {
    // filter
    const filter = { email: req.params.email };

    // $1: find user
    const user = await User.findOne(filter);
    if (!user) {
      return res.status(400).json({ message: 'Email is not associated with a user' });
    } else if (user.isConfirmed) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // $2: email
    await Email.emailConfirmation(user);

    // success response
    res.status(200).json({ message: 'Email sent successfully' });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to send email verification' });
  }
};

/*
  Function: confirm registered user's email
*/

exports.verifyConfirmation = async (req, res) => {
  console.log('verifyConfirmation is called');

  try {
    // verify token
    const token = req.params.emailToken;
    var decodedToken = Token.verifyConfirmationToken(token);
  } catch {
    return res.status(400).json({ message: 'Invalid email confirmation request' });
  }

  try {
    // $1: find user
    const user = await User.findById(decodedToken.userId);
    if (!user) return res.status(400).json({ message: 'Unable to find associated account' });

    // $2: bcrypt
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(401).json({ message: 'Wrong user password entered' });

    // $3: update user
    const filter = { _id: decodedToken.userId };
    const update = { isConfirmed: true };
    const options = { runValidators: true };
    await User.updateOne(filter, update, options);

    // success response
    res.status(200).json({ message: 'success' });
  } catch {
    // error response
    res.status(500).json({ message: 'Unable to verify email address' });
  }
};

/*
  Function: send password reset request to requested email
*/

exports.resetPassword = async (req, res) => {
  console.log('resetPassword is called');
  try {
    // filter
    const filter = { email: req.params.email };

    // $1: find user
    const user = await User.findOne(filter);
    if (!user) {
      return res.status(400).json({ message: 'Email is not associated with a user' });
    } else if (!user.isConfirmed) {
      return res.status(400).json({ message: 'Need to confirm the email  before password reset' });
    }

    // $2: email
    await Email.passwordReset(user);

    // success response
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

/*
  Function: verify password reset and update password field
*/

exports.verifyReset = async (req, res) => {
  console.log('verifyReset is called');
  try {
    // verify token
    const token = req.params.emailToken;
    var decodedToken = Token.verifyPasswordResetToken(token);
  } catch {
    return res.status(400).json({ message: 'Invalid password reset request' });
  }

  try {
    // $1: bcrpt
    const hash = await bcrypt.hash(req.body.password, 10);

    // $2: update user
    const filter = { _id: decodedToken.userId };
    const update = { password: hash };
    const options = { runValidators: true };
    const user = await User.findOneAndUpdate(filter, update, options);
    if (!user) return res.status(400).json({ message: 'Failed to reset your password' });

    // success response
    res.status(200).json({ message: 'success' });
  } catch {
    // error response
    res.status(500).json({ message: 'Failed to reset your password' });
  }
};
