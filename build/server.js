"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _http = _interopRequireDefault(require("http"));

var _app = _interopRequireDefault(require("./app"));

var port = 3000;

var server = _http["default"].createServer(_app["default"]);

server.listen(port, function () {
  return console.info("Application running on port ".concat(port));
});