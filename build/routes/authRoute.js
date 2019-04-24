"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authController = _interopRequireDefault(require("../controllers/authController"));

var router = _express["default"].Router();

router.post('/signup', _authController["default"].signup);
router.post('/signin', _authController["default"].signin);
var _default = router;
exports["default"] = _default;