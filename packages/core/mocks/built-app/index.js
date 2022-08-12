"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;

var _Welcome = require("./templates/Welcome");

var _ResetPassword = require("./templates/ResetPassword");

function App() {
  return {
    Welcome: {
      componentFunction: _Welcome.Welcome,
      props: {
        prefix: 'string'
      }
    },
    ResetPassword: {
      componentFunction: _ResetPassword.ResetPassword,
      props: {}
    }
  };
}