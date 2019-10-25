const errorHandler = (err, req, res, next) => {
  // Log to console
  console.log(err.stack.red);

  // Body-parser Error
  if (err.type === 'entity.parse.failed') {
    return res.status(422).json({ ok: false, message: 'Bad json data' });
  }

  // JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ ok: false, message: 'Invalid access' });
  }

  // Error response
  res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
