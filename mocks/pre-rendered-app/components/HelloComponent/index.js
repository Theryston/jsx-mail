"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelloComponent = HelloComponent;

var _react = _interopRequireDefault(require("react"));

var S = _interopRequireWildcard(require("./styles"));

var _jsxRuntime = require("react/jsx-runtime");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HelloComponent({
  text
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(S.Container, {
    bg: "#fff222",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: text
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Hello World!"
    })]
  });
}