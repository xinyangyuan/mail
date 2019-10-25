const { check, body, oneOf } = require('express-validator');

const { validationResultHandler } = require('./validation-result-handler');
const User = require('../../models/user');
const UserService = require('../../services/user');

/*
  Validator Middleware: signIn
*/

exports.signIn = [
  oneOf([
    [check('email').isEmail(), check('password').isString()],
    [check('userId').isMongoId(), check('password').isString()]
  ]),
  validationResultHandler
];

/*
  Validator Middleware: signUp
*/

exports.signUp = [
  check('firstName').isString(),

  check('lastName').isString(),

  check('email').isEmail(),

  check('role')
    .exists()
    .isIn(User.schema.path('role').enumValues)
    .withMessage(`must in ${User.schema.path('role').enumValues}`),

  check('password')
    .exists()
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

/*
  Validator Middleware: sendEmailVerification
*/

exports.sendEmailVerification = [
  check('email')
    .exists()
    .isEmail(),
  validationResultHandler
];

/*
  Validator Middleware: confirmEmailVerification 
*/

exports.confirmEmailVerification = [
  check('password')
    .exists()
    .isString()
    .withMessage('must be provided'),

  check('emailToken')
    .exists()
    .isString(),

  validationResultHandler
];

/*
  Validator Middleware: forgotPassword
*/

exports.forgotPassword = [
  check('email')
    .exists()
    .isEmail(),
  validationResultHandler
];

/*
  Validator Middleware: confirmEmailVerification
*/

exports.resetPassword = [
  check('emailToken')
    .exists()
    .isString(),

  check('password')
    .exists()
    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('must contain a number'),

  validationResultHandler
];
