const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};

// function verifyToken(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(401).send('Unauthorized request');
//   }
//   let token = req.headers.authorization.split(' ')[1];
//   if (token === 'null') {
//     return res.status(401).send('Unauthorized request');
//   }
//   let payload = jwt.verify(token, 'secretKey');
//   if (!payload) {
//     return res.status(401).send('Unauthorized request');
//   }
//   req.userId = payload.subject;
//   next();
// }
