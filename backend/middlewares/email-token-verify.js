const jwt = require('jsonwebtoken');

emailTokenVerify = (req, res, next) => {
  try {
    const token = req.params.emailToken;
    const decodedToken = jwt.verify(token, process.env.EMAIL_JWT_KEY);

    req.body = { status: decodedToken.status };
    req.userData = { userId: decodedToken.receiverId, isSender: false };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Failed to update mail' });
  }
};

module.exports = emailTokenVerify;
