const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error-response');

/*
  Middleware: require user logged-in
*/

exports.protect = (req, res, next) => {
  try {
    // check auth  header
    if (!(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
      throw Error();
    }

    // access token
    const token = req.headers.authorization.split(' ')[1];

    // synchronous func: will throw error if token is not verified
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: payload.email,
      userId: payload.userId,
      isSender: payload.accountType === 'sender', // converts to boolean,
      role: payload.accountType.toUpperCase()
    };

    //auhVerify is passed
    next();
  } catch (error) {
    next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

/*
  Middleware: require specific log-in role
*/

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userData.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.userData.role} is not authorized to access this route`,
          401
        )
      );
    }
    next();
  };
};
