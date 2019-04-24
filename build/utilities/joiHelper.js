"use strict";

var Joi = require('joi');

var joiHelper = function joiHelper(req, res, schema) {
  var result = Joi.validate(req.body, schema, {
    abortEarly: false
  });

  if (result.error) {
    // 422 Validation Error
    var objError = [];
    Object.keys(result.error.details).forEach(function (key) {
      objError.push(result.error.details[key].message);
    });
    return res.status(422).json({
      status: 422,
      error: objError
    });
  }

  return result;
};

module.exports = joiHelper;