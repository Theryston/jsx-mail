"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPassword = ResetPassword;

var _react = _interopRequireDefault(require("react"));

var _HelloComponent = require("../../components/HelloComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ResetPassword() {
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_HelloComponent.HelloComponent, {
    text: "ResetPassword"
  }));
}