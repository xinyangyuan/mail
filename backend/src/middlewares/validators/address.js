const validator = require('validator');
const ErrorResponse = require('../../utils/error-response');

const { check } = require('express-validator');
const { validationResultHandler } = require('./validation-result-handler');

/*
  Validator Middleware: create address validation
*/

exports.createAddress = [
  check('line1').isString(),

  check('line2').isString(),

  check('city').isString(),

  check('zip').isPostalCode(),

  check('country').isIn(['US', 'UK']),

  validationResultHandler
];

/*
  Validator Middleware: update address validation
*/

exports.updateAddress = [
  check('line1').isString(),

  check('line2').isString(),

  check('city').isString(),

  check('zip').isPostalCode(),

  check('country').isIn(['US', 'UK']),

  validationResultHandler
];
