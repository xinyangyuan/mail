const { validationResult } = require('express-validator');

/*
  Validation result handler
*/

exports.validationResultHandler = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    res.status(422).json({
      message: 'Invalid query',
      error: error.mapped()
    });
  }
};
