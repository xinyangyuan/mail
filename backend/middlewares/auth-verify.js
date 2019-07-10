const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('authVerify is called');
    // get token from the authorization header
    const token = req.headers.authorization.split(' ')[1];

    // synchronous func: will throw error if token is not verified
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      isSender: decodedToken.accountType === 'sender' // converts to boolean
    };

    //auhVerify is passed
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};
