"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _joiHelper = _interopRequireDefault(require("../utilities/joiHelper"));

var _config = require("../../config");

var _validations = require("../utilities/validations");

var _userModel = _interopRequireDefault(require("../models/userModel"));

var doToken = function doToken(user) {
  var token = _jsonwebtoken["default"].sign({
    email: user.email,
    id: user.id,
    type: user.type
  }, _config.jwt_secret, {
    expiresIn: '24h' // expires in 24 hours

  });

  var data = (0, _objectSpread2["default"])({
    token: token
  }, user); // return the JWT token for the future API calls

  return data;
};

var AuthControl =
/*#__PURE__*/
function () {
  function AuthControl() {
    (0, _classCallCheck2["default"])(this, AuthControl);
  }

  (0, _createClass2["default"])(AuthControl, null, [{
    key: "signup",
    value: function () {
      var _signup = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res, next) {
        var validSignup, firstName, lastName, email, password, type, admin, checkExist, user;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _joiHelper["default"])(req, res, _validations.userSignupSchema);

              case 2:
                validSignup = _context.sent;

                if (!(validSignup.statusCode === 422)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                firstName = validSignup.firstName, lastName = validSignup.lastName, email = validSignup.email, password = validSignup.password, type = validSignup.type, admin = validSignup.admin;
                _context.next = 8;
                return _userModel["default"].filter(function (theUser) {
                  return theUser.email == email;
                });

              case 8:
                checkExist = _context.sent;

                if (!(checkExist.length != 0)) {
                  _context.next = 13;
                  break;
                }

                res.status(400);
                next(new Error('Email is already in use'));
                return _context.abrupt("return");

              case 13:
                user = {
                  id: Math.floor(100000 + Math.random() * 900000),
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  type: type,
                  admin: admin
                };

                _bcrypt["default"].hash(password, 10, function (err, hash) {
                  if (err) return next(new Error('Oops something went wrong!'));
                  user.password = hash;

                  _userModel["default"].unshift(user); // return the JWT token for the future API calls


                  var tokenized = doToken(user);
                  return res.json({
                    status: 200,
                    data: tokenized
                  });
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function signup(_x, _x2, _x3) {
        return _signup.apply(this, arguments);
      }

      return signup;
    }()
  }, {
    key: "signin",
    value: function () {
      var _signin = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res, next) {
        var validSignin, email, password, user;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _joiHelper["default"])(req, res, _validations.userSigninSchema);

              case 2:
                validSignin = _context2.sent;

                if (!(validSignin.statusCode === 422)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                email = validSignin.email, password = validSignin.password;
                user = _userModel["default"].find(function (theUser) {
                  return theUser.email === email;
                });

                if (user) {
                  _bcrypt["default"].compare(password, user.password, function (err, result) {
                    if (result) {
                      var tokenized = doToken(user);
                      return res.json({
                        status: 200,
                        data: tokenized
                      });
                    }

                    res.status(400);
                    return next(new Error('Invalid credentials'));
                  });
                } else {
                  res.status(400);
                  next(new Error('Invalid credentials'));
                }

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function signin(_x4, _x5, _x6) {
        return _signin.apply(this, arguments);
      }

      return signin;
    }()
  }]);
  return AuthControl;
}();

var _default = AuthControl;
exports["default"] = _default;