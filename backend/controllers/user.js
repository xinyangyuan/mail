const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
  async helper function
*/
const async_wrapper = promise =>
  promise.then(data => ({ data, error: null })).catch(error => ({ error, data: null }));

/*
  user sign-up function
*/
exports.userSignUp = async (req, res) => {
  // async funtion: generate hash
  const hash = await bcrypt.hash(req.body.password, 10); // bcrpt error is NOT HANDELED

  // async function: create the user in database
  const user = new User({ email: req.body.email, password: hash });
  const { data: dbResponse, error: error } = await async_wrapper(user.save());
  if (error) {
    return res.status(500).json({ message: 'Invalid authentication credentials!' });
  }

  // send to response to frontend
  const payload = { email: user.email, userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

  res.status(201).json({
    token: token,
    expiresDuration: 3600, // unit: second
    userId: dbResponse._id
  });
};

/*
  user sign-in function
*/
exports.userSignIn = async (req, res) => {
  // async funtion: find user with matched email in db
  const { data: user, error } = await async_wrapper(User.findOne({ email: req.body.email }));
  if (error) {
    return res.status(401).json({
      message: 'Email is not associated to user.'
    });
  }

  // async func: check user credentials
  const result = bcrypt.compare(req.body.password, user.password); // bcrpt error is NOT HANDELED
  if (!result) {
    return res.status(401).json({
      message: 'Wrong user password entered.'
    });
  }

  // send to response to frontend
  const payload = { email: user.email, userId: user._id };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

  res.status(200).json({
    token: token,
    expiresDuration: 3600, // unit: second
    userId: user._id
  });
};
