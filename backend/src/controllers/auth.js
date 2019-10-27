const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/async-handler');

const User = require('../models/user');
const ErrorResponse = require('../utils/error-response');
const tokenService = require('../services/token');
const mailService = require('../services/mail');
const emailService = require('../services/email');

/* 
  @desc     Sign-In
  @route    [POST] /api/v1/auth/signin
  @access   Public
*/

exports.signIn = asyncHandler(async (req, res, next) => {
  // filter
  const { email, userId } = req.body;
  const filter = userId ? { _id: userId } : { email }; // can sign-in by email or id

  // $1: find user
  const user = await User.findOne(filter).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  } else if (user.status === 'UNCONFIRMED') {
    return next(new ErrorResponse('Please verify your email address', 400));
  }

  // $2: check user credentials
  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return next(new ErrorResponse('Invalid credentials', 401));

  // tokens
  const token = tokenService.generateAuthToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  // success response
  res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
  res.status(200).json({ ok: true, token });
});

/* 
  @desc     Sign-Up
  @route    [POST] /api/v1/auth/signup
  @access   Public
*/

exports.signUp = async (req, res, next) => {
  // start session and transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // request, options
    const { firstName, lastName, email, password, role } = req.body;
    const options = { session: session };

    // $1: create hash
    const hash = await bcrypt.hash(password, 10);

    // $2: create user - transaction
    const user_ = new User({
      name: { first: firstName, last: lastName },
      email: email,
      password: hash,
      role: role
    });
    const user = await user_.save(options);

    // $3: send gretting mail - transaction
    await mailService.sendWelcomeMail(user, session);

    // $4: send email
    await emailService.emailConfirmation(user);

    // complete transaction and closes session
    await session.commitTransaction();
    session.endSession();

    // success response:
    res.status(201).json({ ok: true, message: `Hello world: ${user.email} is signed up` });
  } catch (error) {
    // closes transaction and session
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/* 
  @desc     Refresh access token 
  @route    [POST] /api/v1/auth/refresh_token
  @access   Public
*/

exports.refreshToken = async (req, res) => {
  try {
    // refreshToken
    let refreshToken = req.cookies.jid;
    if (!refreshToken) throw Error();

    // verify token - throw error if invalid token
    const payload = tokenService.verifyRefreshToken(refreshToken);

    // $1: find user
    const user = await User.findById(payload.userId);
    if (!user) throw Error();

    // new tokens
    const token = tokenService.generateAuthToken(user);
    refreshToken = tokenService.generateRefreshToken(user);

    // success response
    res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
    res.status(200).json({ ok: true, token });
  } catch (error) {
    // error response
    res.json({ ok: false, message: 'Invalid access' });
  }
};

/* 
  @desc     Sign-Out - clear cookie
  @route    [POST] /api/v1/auth/signout
  @access   Public
*/

exports.signOut = asyncHandler(async (req, res, next) => {
  res.cookie('jid', '', { httpOnly: true }); // path: '/refresh_token'
  res.status(200).json({ ok: true });
});

/* 
  @desc     Send email-verification email
  @route    [GET] /api/v1/confirmation/:email
  @access   Public
*/

exports.sendEmailVerification = asyncHandler(async (req, res, next) => {
  // filter
  const filter = { email: req.body.email };

  // $1: find user
  const user = await User.findOne(filter);
  if (!user) {
    return next(new ErrorResponse('Email is not associated with a user', 400));
  } else if (user.status !== 'UNCONFIRMED') {
    return next(new ErrorResponse('Email is already verified', 400));
  }

  // $2: email
  await emailService.emailConfirmation(user);

  // success response
  res.status(200).json({ ok: true, message: 'Email sent successfully' });
});

/* 
  @desc     Confirm email-verification email - update user status, also login-in user
  @route    [POST] /api/v1/confirmation/:emailToken
  @access   Public
*/

exports.confirmEmailVerification = asyncHandler(async (req, res, next) => {
  // verify token - error handled in error-handler.js
  const payload = tokenService.verifyConfirmationToken(req.body.emailToken);

  // $1: find user
  const user = await User.findById(payload.userId).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  // $2: bcrypt
  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return next(new ErrorResponse('Invalid credentials', 401));

  // $3: update user
  const filter = { _id: payload.userId };
  const update = { status: 'ACTIVE' };
  const options = { runValidators: true };
  await User.updateOne(filter, update, options);

  // tokens
  const token = tokenService.generateAuthToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  // success response
  res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
  res.status(200).json({ ok: true, message: 'success', token });
});

/* 
  @desc     Forgot password - send password reset email
  @route    [GET] /api/v1/reset/:email
  @access   Public
*/

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // filter
  const filter = { email: req.body.email };

  // $1: find user
  const user = await User.findOne(filter);
  if (!user) {
    return next(new ErrorResponse('Email is not associated with a user', 400));
  } else if (user.status === 'UNCONFIRMED') {
    return next(new ErrorResponse('Need to confirm the email before password reset', 400));
  }

  // $2: email
  await emailService.passwordReset(user);

  // success response
  res.status(200).json({ ok: true, message: 'Password reset email sent successfully' });
});

/* 
  @desc     Reset password - also log-in user
  @route    [POST] /api/v1/reset/:emailToken
  @access   Public
*/

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // verify token
  const payload = tokenService.verifyPasswordResetToken(req.body.emailToken);

  // $1: bcrpt
  const hash = await bcrypt.hash(req.body.password, 10);

  // $2: update user
  const filter = { _id: payload.userId };
  const update = { password: hash };
  const options = { runValidators: true };
  const user = await User.updateOne(filter, update, options);
  if (!user) return next(new ErrorResponse('Failed to reset your password', 400));

  // tokens
  const token = tokenService.generateAuthToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);

  // success response
  res.cookie('jid', refreshToken, { httpOnly: true }); // path: '/refresh_token'
  res.status(200).json({ ok: true, message: 'Password reset success', token });
});
