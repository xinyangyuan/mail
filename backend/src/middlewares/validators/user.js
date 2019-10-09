const { check, body } = require('express-validator');

const { validationResultHandler } = require('./validation-result-handler');
const User = require('../../models/user');
const UserService = require('../../services/user');

/*
  Validator Middleware: signIn
*/

exports.signIn = [check('email').isEmail(), check('password').exists(), validationResultHandler];

/*
  Validator Middleware: signUp
*/

exports.signUp = [
  check('firstName').isString(),

  check('lastName').isString(),

  check('email').isEmail(),

  check('role')
    .isIn(User.schema.path('role').enumValues)
    .withMessage(`must in ${User.schema.path('role').enumValues}`),

  check('password')
    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('must contain a number'),

  check('code')
    .if(body('role').equals('SENDER'))
    .exists()
    .withMessage('must be provided')
    .custom(UserService.senderSignupCodeVerify)
    .withMessage('invalid sign-up code'),

  validationResultHandler
];
