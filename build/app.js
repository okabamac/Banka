"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cors = _interopRequireDefault(require("cors"));

var _userRoute = _interopRequireDefault(require("./routes/userRoute"));

var _authRoute = _interopRequireDefault(require("./routes/authRoute"));

var _accountRoute = _interopRequireDefault(require("./routes/accountRoute"));

var _transactionRoute = _interopRequireDefault(require("./routes/transactionRoute"));

var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use('/api/v1/auth', _authRoute["default"]);
app.use('/api/v1/users', _userRoute["default"]);
app.use('/api/v1/accounts', _accountRoute["default"]);
app.use('/api/v1/transactions', _transactionRoute["default"]);
app.use(function (req, res, next) {
  var error = new Error('Not found');
  res.statusCode = 404;
  next(error);
});
app.use(function (error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    status: res.statusCode,
    error: error.message
  });
});
var _default = app;
exports["default"] = _default;