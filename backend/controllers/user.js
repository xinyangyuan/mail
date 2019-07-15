const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
  Helper Function: Go-lang style async wrapper
*/

const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  Function: signup
*/

exports.userSignUp = async (req, res) => {
  // async funtion: generate hash, hash(plainPassword, saltRounds)
  // saltRounds really mean cost factor, pick the cost according to the server setup
  // https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993
  const hash = await bcrypt.hash(req.body.password, 10); // bcrpt error is NOT HANDELED

  // async function: create the user in database
  const user = new User({ email: req.body.email, password: hash, isSender: req.body.isSender });
  const { error, data: fetchedUser } = await async_wrapper(user.save());

  if (error || !fetchedUser) {
    // 500 or 401
    return res.status(401).json({ message: 'Your email is already registered!' });
  }

  // get account type
  const accountType = fetchedUser.isSender ? 'sender' : 'user';

  // send the response to frontend
  const payload = {
    email: fetchedUser.email,
    userId: fetchedUser._id,
    accountType: accountType
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

  res.status(201).json({
    token: token,
    expiresDuration: 3600, // unit: second
    userId: fetchedUser._id,
    isSender: fetchedUser.isSender
  });
};

/*
  Function: sign-in
*/

exports.userSignIn = async (req, res) => {
  // async funtion: find user with matched email in db
  const { error, data: fetchedUser } = await async_wrapper(User.findOne({ email: req.body.email }));

  if (error || !fetchedUser) {
    return res.status(401).json({
      message: 'Email is not associated to a user.'
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
