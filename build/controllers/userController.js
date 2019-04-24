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

var _userModel = _interopRequireDefault(require("../models/userModel"));

var UserControl =
/*#__PURE__*/
function () {
  function UserControl() {
    (0, _classCallCheck2["default"])(this, UserControl);
  }

  (0, _createClass2["default"])(UserControl, null, [{
    key: "getAll",
    value: function () {
      var _getAll = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(req, res, next) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(req.decoded.type == 'client')) {
                  _context.next = 3;
                  break;
                }

                res.status(401);
                return _context.abrupt("return", next(new Error('Only staff and admins can access this routes')));

              case 3:
                res.json({
                  status: 200,
                  data: _userModel["default"]
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
        var userId, user;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(req.decoded.type == 'client')) {
                  _context2.next = 3;
                  break;
                }

                res.status(401);
                return _context2.abrupt("return", next(new Error('Only staff and admins can access this routes')));

              case 3:
                userId = req.params.userId;
                _context2.next = 6;
                return _userModel["default"].filter(function (theUser) {
                  return theUser.id == userId;
                })[0];

              case 6:
                user = _context2.sent;

                if (user) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", next());

              case 9:
                return _context2.abrupt("return", res.json({
                  status: 200,
                  data: user
                }));

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
    key: "deleteUser",
    value: function () {
      var _deleteUser = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(req, res, next) {
        var userId, user, index;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(req.decoded.type == 'client')) {
                  _context3.next = 3;
                  break;
                }

                res.status(401);
                return _context3.abrupt("return", next(new Error('Only staff and admins can access this routes')));

              case 3:
                userId = req.params.userId;
                _context3.next = 6;
                return _userModel["default"].filter(function (theUser) {
                  return theUser.id == userId;
                })[0];

              case 6:
                user = _context3.sent;

                if (user) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", next());

              case 9:
                index = _userModel["default"].indexOf(user);

                _userModel["default"].splice(index, 1);

                res.json({
                  status: 200,
                  message: 'User successfully deleted'
                });

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function deleteUser(_x7, _x8, _x9) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }]);
  return UserControl;
}();

var _default = UserControl;
exports["default"] = _default;