"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jwt = _interopRequireDefault(require("../utilities/jwt"));

var _transactionController = _interopRequireDefault(require("../controllers/transactionController"));

var router = _express["default"].Router();

router.get('/', _jwt["default"], _transactionController["default"].getAll);
router.get('/:transactionId', _jwt["default"], _transactionController["default"].getOne);
router.get('/client/:accountNumber', _jwt["default"], _transactionController["default"].getAllByClient);
router.post('/:accountNumber/debit', _jwt["default"], _transactionController["default"].debit);
router.post('/:accountNumber/credit', _jwt["default"], _transactionController["default"].credit);
var _default = router;
exports["default"] = _default;