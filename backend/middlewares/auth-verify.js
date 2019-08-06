const jwt = require('jsonwebtoken');

/*
  Middleware: check user authentication via JWT
*/

exports.authVerify = (req, res, next) => {
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

/*
  Middleware: sender role authentication
*/

exports.senderVerify = (req, res, next) => {
  console.log('senderVerify is called');

  // verify account type is sender
  if (req.userData.isSender) {
    next();
  } else {
    // senderVerify failed
    res.status(403).json({ message: 'You are not authorized!' });
  }
};

/*
  Middleware: user role authentication
*/

exports.userVerify = (req, res, next) => {
  console.log('userVerify is called');

  // verify account type is sender
  if (!req.userData.isSender) {
    next();
  } else {
    // senderVerify failed
    res.status(403).json({ message: 'You are not authorized!' });
  }
};
