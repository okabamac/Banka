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

var _transactionModel = _interopRequireDefault(require("../models/transactionModel"));

var _accountModel = _interopRequireDefault(require("../models/accountModel"));

var _joiHelper = _interopRequireDefault(require("../utilities/joiHelper"));

var _validations = require("../utilities/validations");

var createTransaction = function createTransaction(account, transactionType, accountNumber, amount) {
  return {
    transactionId: Math.floor(100000 + Math.random() * 900000),
    createdOn: new Date(Date.now()),
    transactionType: transactionType,
    accountNumber: accountNumber,
    cashier: 15663,
    amount: amount,
    currency: account.currency,
    oldBalance: account.balance,
    newBalance: transactionType === 'credit' ? account.balance + amount : account.balance - amount
  };
};

var TransactionControl =
/*#__PURE__*/
function () {
  function TransactionControl() {
    (0, _classCallCheck2["default"])(this, TransactionControl);
  }

  (0, _createClass2["default"])(TransactionControl, null, [{
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
                return _context.abrupt("return", next(new Error('Only staff and admins can view all transactions')));

              case 3:
                res.json({
                  status: 200,
                  data: _transactionModel["default"]
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
    key: "getAllByClient",
    value: function () {
      var _getAllByClient = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(req, res, next) {
        var accountNumber, allTransactionsByClient;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(req.decoded.type !== 'client')) {
                  _context2.next = 3;
                  break;
                }

                res.status(401);
                return _context2.abrupt("return", next(new Error('Only clients can access this route')));

              case 3:
                _context2.prev = 3;
                accountNumber = req.params.accountNumber;
                _context2.next = 7;
                return _transactionModel["default"].filter(function (all) {
                  return all.accountNumber == accountNumber;
                });

              case 7:
                allTransactionsByClient = _context2.sent;

                if (!(allTransactionsByClient.length == 0)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt("return", next());

              case 10:
                res.json({
                  status: 200,
                  data: allTransactionsByClient
                });
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](3);
                next();

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[3, 13]]);
      }));

      function getAllByClient(_x4, _x5, _x6) {
        return _getAllByClient.apply(this, arguments);
      }

      return getAllByClient;
    }()
  }, {
    key: "getOne",
    value: function () {
      var _getOne = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(req, res, next) {
        var transactionId, transaction;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                transactionId = req.params.transactionId;
                _context3.next = 3;
                return _transactionModel["default"].filter(function (theTransaction) {
                  return theTransaction.id == transactionId;
                })[0];

              case 3:
                transaction = _context3.sent;

                if (transaction) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return", next());

              case 6:
                res.json({
                  status: 200,
                  data: transaction
                });

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getOne(_x7, _x8, _x9) {
        return _getOne.apply(this, arguments);
      }

      return getOne;
    }()
  }, {
    key: "debit",
    value: function () {
      var _debit = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(req, res, next) {
        var accountNumber, account, validCreditAccount, type, amount, transaction;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(req.decoded.type !== 'staff')) {
                  _context4.next = 3;
                  break;
                }

                res.status(401);
                return _context4.abrupt("return", next(new Error('Only staff cand debit')));

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
                return (0, _joiHelper["default"])(req, res, _validations.creditAccountSchema);

              case 11:
                validCreditAccount = _context4.sent;

                if (!(validCreditAccount.statusCode === 422)) {
                  _context4.next = 14;
                  break;
                }

                return _context4.abrupt("return");

              case 14:
                type = 'debit';
                amount = validCreditAccount.amount;

                if (!(account.balance <= amount)) {
                  _context4.next = 19;
                  break;
                }

                res.status(400);
                return _context4.abrupt("return", next(new Error('Insufficient fund')));

              case 19:
                transaction = createTransaction(account, type, accountNumber, amount);

                _transactionModel["default"].unshift(transaction);

                account.balance = transaction.newBalance;
                return _context4.abrupt("return", res.json({
                  status: 200,
                  data: transaction
                }));

              case 23:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function debit(_x10, _x11, _x12) {
        return _debit.apply(this, arguments);
      }

      return debit;
    }()
  }, {
    key: "credit",
    value: function () {
      var _credit = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(req, res, next) {
        var accountNumber, account, validCreditAccount, type, amount, transaction;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(req.decoded.type !== 'staff')) {
                  _context5.next = 3;
                  break;
                }

                res.status(401);
                return _context5.abrupt("return", next(new Error('Only staff can credit')));

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
                _context5.next = 11;
                return (0, _joiHelper["default"])(req, res, _validations.creditAccountSchema);

              case 11:
                validCreditAccount = _context5.sent;

                if (!(validCreditAccount.statusCode === 422)) {
                  _context5.next = 14;
                  break;
                }

                return _context5.abrupt("return");

              case 14:
                type = 'credit';
                amount = validCreditAccount.amount;
                transaction = createTransaction(account, type, accountNumber, amount);

                _transactionModel["default"].unshift(transaction);

                account.balance = transaction.newBalance;
                return _context5.abrupt("return", res.json({
                  status: 200,
                  data: transaction
                }));

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function credit(_x13, _x14, _x15) {
        return _credit.apply(this, arguments);
      }

      return credit;
    }()
  }]);
  return TransactionControl;
}();

var _default = TransactionControl;
exports["default"] = _default;