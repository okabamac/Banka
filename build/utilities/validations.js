"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _joi = _interopRequireDefault(require("joi"));

// avatar: Joi.binary().encoding('base64').max(2 * 1024 * 1024)
var alphaNum = _joi["default"].string().alphanum();

var nameSchema = alphaNum.min(2).max(30);

var emailSchema = _joi["default"].string().email({
  minDomainAtoms: 2
});

var userSignupSchema = _joi["default"].object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  email: emailSchema.required(),
  password: _joi["default"].string().min(6).max(30).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmPassword: _joi["default"].any().valid(_joi["default"].ref('password')).required().options({
    language: {
      any: {
        allowOnly: 'must match password'
      }
    }
  }),
  type: _joi["default"].string().min(3).max(15)["default"]('client', {
    invalid: true
  }),
  admin: _joi["default"]["boolean"]()["default"](false, {
    invalid: true
  })
});

var userSigninSchema = _joi["default"].object().keys({
  email: emailSchema.required(),
  password: _joi["default"].string().min(6).max(30).regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

var createAccountSchema = _joi["default"].object().keys({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  dob: _joi["default"].date().min('1-1-1900').iso().required(),
  sex: _joi["default"].string().min(4).max(10).required(),
  email: emailSchema.required(),
  phone: _joi["default"].string().required(),
  type: _joi["default"].string().valid('Savings', 'Current').required(),
  currency: _joi["default"].string()["default"]('Naira', {
    invalid: true
  }),
  address: _joi["default"].string().min(4).max(500).required()
});

var patchAccountSchema = _joi["default"].object().keys({
  status: _joi["default"].string().max(10).required()
});

var creditAccountSchema = _joi["default"].object().keys({
  amount: _joi["default"].number().integer().min(0).required()
});

module.exports = {
  userSignupSchema: userSignupSchema,
  userSigninSchema: userSigninSchema,
  createAccountSchema: createAccountSchema,
  patchAccountSchema: patchAccountSchema,
  creditAccountSchema: creditAccountSchema
};