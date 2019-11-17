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

  // Stripe signature verification error
  if (err.type === 'StripeSignatureVerificationError') {
    return res.status(401).json({ ok: false, message: 'Not authorized to access this route' });
  }

  // Mongoose filter error: actual object filed passes with wrong parameter type FIXME:
  if (err.name === 'ObjectParameterError' || err.name === 'CastError') {
    return res.status(400).json({ ok: false, message: 'Invalid query parameters' });
  }

  // Error response [development]
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode || 500).json({
      ok: false,
      message: err.message || 'Server Error'
    });
  }

  // Error response [production]
  if (err.statusCode && err.message) {
    return res.status(err.statusCode).json({ ok: false, message: err.message });
  } else {
    return res.status(500).json({ ok: false, message: 'Server Error' }); // only generic msg for unhandeled error
  }
};

module.exports = errorHandler;
