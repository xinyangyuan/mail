const { check, body } = require('express-validator');
const { validationResultHandler } = require('./validation-result-handler');

/*
  Validator Middleware: create mail
*/

exports.createMail = [
  check('title').isString(),

  check('description').isString(),

  check('content').isString(),

  check('receiverId').isMongoId(),

  //   check('envelop').exists(),

  validationResultHandler
];
