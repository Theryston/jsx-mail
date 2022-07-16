"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Welcome = Welcome;

var _react = _interopRequireDefault(require("react"));

var _HelloComponent = require("../../components/HelloComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Welcome({
  prefix
}) {
  return /*#__PURE__*/_react.default.createElement("div", null, prefix, /*#__PURE__*/_react.default.createElement(_HelloComponent.HelloComponent, {
    text: "Welcome"
  }));
}