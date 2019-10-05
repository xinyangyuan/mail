const jwt = require('jsonwebtoken');

/*
  Generate Auth Token:
*/

exports.generateAuthToken = user => {
  const payload = {
    email: user.email,
    userId: user._id,
    accountType: user.isSender ? 'sender' : 'user'
  };
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '15m' });
};

/*
  Generate Refresh Token:
*/

exports.generateRefreshToken = user => {
  const payload = { userId: user._id };
  return jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '2d' });
};

/*
  Verify Refresh Token:
*/

exports.verifyRefreshToken = token => {
  return jwt.verify(token, process.env.JWT_REFRESH_KEY);
};

/*
  Generate Email Confirmation Token:
*/

exports.generateConfirmationToken = user => {
  const payload = { userId: user._id };
  return jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });
};

/*
  Verify Email Confirmation  Token:
*/

exports.verifyConfirmationToken = token => {
  return jwt.verify(token, process.env.EMAIL_JWT_KEY);
};

/*
  Generate Password Reset Token:
*/

exports.generatePasswordResetToken = user => {
  const payload = { userId: user._id };
  return jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '1h' });
};

/*
  Verify Password Reset Token:
*/

exports.verifyPasswordResetToken = token => {
  return jwt.verify(token, process.env.EMAIL_JWT_KEY);
};

/*
  Generate Scan Token:
*/

exports.generateScanToken = mail => {
  const payload = { receiverId: mail.receiverId, status: 'SCANNING' };
  return jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '24h' });
};

/*
  Generate Skip-Scan Token:
*/

exports.generateSkipScanToken = mail => {
  const payload = { receiverId: mail.receiverId, status: 'UNSCANNED_ARCHIVED' };
  return jwt.sign(payload, process.env.EMAIL_JWT_KEY, { expiresIn: '24h' });
};
