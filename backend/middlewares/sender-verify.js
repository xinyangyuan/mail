/*
  Middleware: sender role authentication
*/

module.exports = (req, res, next) => {
  console.log('senderVerify is called');

  // verify account type is sender
  if (req.userData.isSender) {
    next();
  } else {
    // senderVerify failed
    res.status(403).json({ message: 'You are not authorized!' });
  }
};
