"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jwt = _interopRequireDefault(require("../utilities/jwt"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

var router = _express["default"].Router();

router.get('/', _jwt["default"], _userController["default"].getAll);
router.get('/:userId', _jwt["default"], _userController["default"].getOne);
router["delete"]('/:userId', _jwt["default"], _userController["default"].deleteUser);
var _default = router;
exports["default"] = _default;