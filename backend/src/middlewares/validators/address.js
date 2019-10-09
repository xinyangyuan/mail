const { check } = require('express-validator');

const { validationResultHandler } = require('./validation-result-handler');
const User = require('../../models/user');

/*
  Validator Middleware: signUp
*/

exports.signUp = [
  check('line1').isString(),

  check('line2').isString(),

  check('city').isString(),

  check('zip').isPostalCode(),

  check('country').isIn(),

  validationResultHandler
];
