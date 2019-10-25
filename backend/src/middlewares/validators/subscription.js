const { check, body } = require('express-validator');
const { validationResultHandler } = require('./validation-result-handler');

/*
  Validator Middleware: create subscription
*/

exports.createSubscription = [
  check('planIds')
    .exists()
    .isArray(),

  check('addressId')
    .exists()
    .isMongoId(),

  check('mailboxNo')
    .exists()
    .isNumeric(),

  validationResultHandler
];
