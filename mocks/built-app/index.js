"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Welcome = require("./templates/Welcome");

Object.keys(_Welcome).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _Welcome[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Welcome[key];
    }
  });
});

var _ResetPassword = require("./templates/ResetPassword");

Object.keys(_ResetPassword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ResetPassword[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ResetPassword[key];
    }
  });
});