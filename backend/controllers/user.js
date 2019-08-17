const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
  Helper Function: Go-lang style async wrapper
*/

const async_wrapper = promise =>
  promise
    // on success
    .then(data => ({ data, error: null }))
    // on error
    .catch(error => ({ error, data: null }));

/*
  Function: signup
*/

exports.userSignUp = async (req, res, next) => {
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
    return res.status(401).json({ message: 'Your email is already registered!' });
  }

  // generate email verifcation link
  const payload = {
    userId: fetchedUser._id
  };
  const emailToken = jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });

  // user data & email data
  req.fetchedUser = fetchedUser;
  req.emailData = {
    name: fetchedUser.fullName,
    email: req.body.email,
    emailToken
  };
  next();
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
  Function: (re)-send email verification
*/

exports.sendConfirmation = async (req, res, next) => {
  console.log('sendConfirmation is called');

  // async funtion: find user with matched email in db
  const { error, data: fetchedUser } = await async_wrapper(
    User.findOne({ email: req.params.email })
  );

  if (error || !fetchedUser) {
    return res.status(401).json({
      message: 'Email is not associated to a user.'
    });
  }

  if (fetchedUser.isConfirmed) {
    return res.status(401).json({
      message: 'Email is already verified.'
    });
  }

  // generate email verifcation link
  const payload = {
    userId: fetchedUser._id
  };
  const emailToken = jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });

  // email data
  req.fetchedUser = fetchedUser;
  req.emailData = {
    name: fetchedUser.fullName,
    email: req.params.email,
    emailToken
  };
  next();
};

/*
  Function: confirm registered user's email
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
    const result = await bcrypt.compare(req.body.password, fetchedUser.password);
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
      User.findOneAndUpdate({ _id: decodedEmailToken.userId }, update, { runValidators: true })
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
      email: updatedUser.email,
      token: token,
      expiresDuration: 3600, // unit: second
      userId: updatedUser._id,
      isSender: updatedUser.isSender
    });
  } catch {
    console.log('error occured');
    return res.status(401).json({
      message: 'Invalid confirmation request.'
    });
  }
};

/*
  Function: send password reset request to requested email
*/

exports.resetPassword = async (req, res, next) => {
  console.log('resetPassword is called');

  // async funtion: find user with matched email in db
  const { error, data: fetchedUser } = await async_wrapper(
    User.findOne({ email: req.params.email })
  );

  if (error || !fetchedUser) {
    return res.status(401).json({
      message: 'Email is not associated to a user'
    });
  }

  if (!fetchedUser.isConfirmed) {
    return res.status(401).json({
      message: 'Need to confirm the email address before password reset'
    });
  }

  // generate email verifcation link
  const payload = {
    userId: fetchedUser._id
  };
  const emailToken = jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });

  // email data
  req.emailData = {
    name: fetchedUser.fullName,
    email: req.params.email,
    emailToken
  };
  next();
};

/*
  Function: verify password reset and update password field
*/

exports.verifyReset = async (req, res) => {
  try {
    console.log('verifyReset is called');
    // get email token from param
    const emailToken = req.params.emailToken;

    // synchronous func: will throw error if token is not verified
    const decodedEmailToken = jwt.verify(emailToken, process.env.EMAIL_JWT_KEY);

    // generate new password hash
    const hash = await bcrypt.hash(req.body.password, 10);

    // update the user confirmation status
    const update = {
      $set: { password: hash }
    };
    const { err, data: fetchedUser } = await async_wrapper(
      User.findOneAndUpdate({ _id: decodedEmailToken.userId }, update, { runValidators: true })
    );
    if (err || !fetchedUser) {
      return res.status(401).json({
        message: 'Failed to reset your password.'
      });
    }

    // finally send the response to frontend
    const payload = {
      email: fetchedUser.email,
      userId: fetchedUser._id,
      accountType: fetchedUser.isSender ? 'sender' : 'user'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

    res.status(200).json({
      email: fetchedUser.email,
      token: token,
      expiresDuration: 3600, // unit: second
      userId: fetchedUser._id,
      isSender: fetchedUser.isSender
    });
  } catch {
    console.log('error occured');
    return res.status(401).json({
      message: 'Invalid password reset request'
    });
  }
};
