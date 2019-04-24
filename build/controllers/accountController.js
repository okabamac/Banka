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

var _joiHelper = _interopRequireDefault(require("../utilities/joiHelper"));

var _accountModel = _interopRequireDefault(require("../models/accountModel"));

var _validations = require("../utilities/validations");

var AccountControl =
/*#__PURE__*/
function () {
  function AccountControl() {
    (0, _classCallCheck2["default"])(this, AccountControl);
  }

  (0, _createClass2["default"])(AccountControl, null, [{
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res, next) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(req.decoded.type === 'client')) {
                  _context.next = 3;
                  break;
                }

                res.status(401);
                return _context.abrupt("return", next(new Error('Only staff and admins can view all accounts')));

              case 3:
                res.json({
                  status: 200,
                  data: _accountModel["default"]
                });

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAll(_x, _x2, _x3) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }()
  }, {
    key: "getOne",
    value: function () {
      var _getOne = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res, next) {
        var accountNumber, account;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(req.decoded.type === 'client')) {
                  _context2.next = 3;
                  break;
                }

                res.status(401);
                return _context2.abrupt("return", next(new Error('Only staff and admins can view a specific account')));

              case 3:
                accountNumber = req.params.accountNumber;
                _context2.next = 6;
                return _accountModel["default"].filter(function (theAccount) {
                  return theAccount.accountNumber == accountNumber;
                })[0];

              case 6:
                account = _context2.sent;

                if (account) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", next());

              case 9:
                res.json({
                  status: 200,
                  data: account
                });

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getOne(_x4, _x5, _x6) {
        return _getOne.apply(this, arguments);
      }

      return getOne;
    }()
  }, {
    key: "createAccount",
    value: function () {
      var _createAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(req, res, next) {
        var validCreateAccount, firstName, lastName, sex, dob, email, phone, type, currency, account;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(req.decoded.type !== 'client')) {
                  _context3.next = 3;
                  break;
                }

                res.status(401);
                return _context3.abrupt("return", next(new Error('Only clients can create bank accounts')));

              case 3:
                _context3.next = 5;
                return (0, _joiHelper["default"])(req, res, _validations.createAccountSchema);

              case 5:
                validCreateAccount = _context3.sent;

                if (!(validCreateAccount.statusCode === 422)) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return");

              case 8:
                firstName = validCreateAccount.firstName, lastName = validCreateAccount.lastName, sex = validCreateAccount.sex, dob = validCreateAccount.dob, email = validCreateAccount.email, phone = validCreateAccount.phone, type = validCreateAccount.type, currency = validCreateAccount.currency;
                account = {
                  accountNumber: Math.floor(100000 + Math.random() * 9000000000),
                  firstName: firstName,
                  lastName: lastName,
                  sex: sex,
                  dob: dob,
                  email: email,
                  phone: phone,
                  type: type,
                  currency: currency
                };
                account.openingBalance = 0.00;
                account.status = 'active';

                _accountModel["default"].unshift(account);

                res.json({
                  status: 200,
                  data: account
                });

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createAccount(_x7, _x8, _x9) {
        return _createAccount.apply(this, arguments);
      }

      return createAccount;
    }()
  }, {
    key: "modifyAccount",
    value: function () {
      var _modifyAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(req, res, next) {
        var accountNumber, account, validPatch, status;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(req.decoded.type === 'client')) {
                  _context4.next = 3;
                  break;
                }

                res.status(401);
                return _context4.abrupt("return", next(new Error('Only staff and admins can modify accounts')));

              case 3:
                accountNumber = req.params.accountNumber;
                _context4.next = 6;
                return _accountModel["default"].filter(function (theAccount) {
                  return theAccount.accountNumber == accountNumber;
                })[0];

              case 6:
                account = _context4.sent;

                if (account) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt("return", next());

              case 9:
                _context4.next = 11;
                return (0, _joiHelper["default"])(req, res, _validations.patchAccountSchema);

              case 11:
                validPatch = _context4.sent;

                if (!(validPatch.statusCode === 422)) {
                  _context4.next = 14;
                  break;
                }

                return _context4.abrupt("return");

              case 14:
                status = validPatch.status;
                account.status = validPatch.status;
                return _context4.abrupt("return", res.json({
                  status: 200,
                  data: {
                    accountNumber: accountNumber,
                    status: status
                  }
                }));

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function modifyAccount(_x10, _x11, _x12) {
        return _modifyAccount.apply(this, arguments);
      }

      return modifyAccount;
    }()
  }, {
    key: "deleteAccount",
    value: function () {
      var _deleteAccount = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(req, res, next) {
        var accountNumber, account, index;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(req.decoded.type === 'client')) {
                  _context5.next = 3;
                  break;
                }

                res.status(401);
                return _context5.abrupt("return", next(new Error('Only staff and admins can delete accounts')));

              case 3:
                accountNumber = req.params.accountNumber;
                _context5.next = 6;
                return _accountModel["default"].filter(function (theAccount) {
                  return theAccount.accountNumber == accountNumber;
                })[0];

              case 6:
                account = _context5.sent;

                if (account) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt("return", next());

              case 9:
                index = _accountModel["default"].indexOf(account);

                _accountModel["default"].splice(index, 1);

                res.json({
                  status: 200,
                  message: 'Account successfully deleted'
                });

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function deleteAccount(_x13, _x14, _x15) {
        return _deleteAccount.apply(this, arguments);
      }

      return deleteAccount;
    }()
  }]);
  return AccountControl;
}();

var _default = AccountControl;
exports["default"] = _default;