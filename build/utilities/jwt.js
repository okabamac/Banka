"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = require("../../config");

// Credit to https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
var checkToken = function checkToken(req, res, next) {
  var token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase

  if (!token) {
    return res.json({
      status: 401,
      error: 'Auth token is not supplied'
    });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    _jsonwebtoken["default"].verify(token, _config.jwt_secret, function (err, decoded) {
      if (err) {
        res.status(422);
        return res.json({
          status: 422,
          error: 'Token is not valid'
        });
      }

      req.decoded = decoded;
      next();
    });
  }
};

module.exports = checkToken;