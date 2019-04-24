"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jwt = _interopRequireDefault(require("../utilities/jwt"));

var _accountController = _interopRequireDefault(require("../controllers/accountController"));

var router = _express["default"].Router();

router.get('/', _jwt["default"], _accountController["default"].getAll);
router.get('/:accountNumber', _jwt["default"], _accountController["default"].getOne);
router.post('/', _jwt["default"], _accountController["default"].createAccount);
router.patch('/:accountNumber', _jwt["default"], _accountController["default"].modifyAccount);
router["delete"]('/:accountNumber', _jwt["default"], _accountController["default"].deleteAccount);
var _default = router;
exports["default"] = _default;