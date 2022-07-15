"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Welcome = Welcome;

var _react = _interopRequireDefault(require("react"));

var _HelloComponent = require("../../components/HelloComponent");

var _jsxRuntime = require("react/jsx-runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Welcome({
  prefix
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [prefix, /*#__PURE__*/(0, _jsxRuntime.jsx)(_HelloComponent.HelloComponent, {
      text: "Welcome"
    })]
  });
}