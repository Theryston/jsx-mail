"use strict";
/**
 * Internal tools for use within Gluegun
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.prop = exports.times = exports.equals = exports.takeLast = exports.is = exports.reject = exports.last = exports.replace = exports.keys = exports.forEach = exports.trim = exports.tail = exports.split = exports.isNil = exports.identity = exports.head = void 0;
var head = function (a) { return a[0]; };
exports.head = head;
var tail = function (a) { return a.slice(1); };
exports.tail = tail;
var identity = function (a) { return a; };
exports.identity = identity;
var isNil = function (a) { return a === null || a === undefined; };
exports.isNil = isNil;
var split = function (b, a) { return a.split(b); };
exports.split = split;
var trim = function (a) { return a.trim(); };
exports.trim = trim;
var forEach = function (f, a) { return a.forEach(f); };
exports.forEach = forEach;
var keys = function (a) { return (Object(a) !== a ? [] : Object.keys(a)); };
exports.keys = keys;
var replace = function (b, c, a) { return a.replace(b, c); };
exports.replace = replace;
var last = function (a) { return a[a.length - 1]; };
exports.last = last;
var reject = function (f, a) { return a.filter(function (b) { return !f(b); }); };
exports.reject = reject;
var is = function (Ctor, val) { return (val != null && val.constructor === Ctor) || val instanceof Ctor; };
exports.is = is;
var takeLast = function (n, a) { return a.slice(-1 * n); };
exports.takeLast = takeLast;
var equals = function (a, b) { return a.length === b.length && a.every(function (v, i) { return v === b[i]; }); };
exports.equals = equals;
var times = function (fn, n) {
    var list = new Array(n);
    for (var i = 0; i < n; i++)
        list[i] = fn(i);
    return list;
};
exports.times = times;
var prop = function (p, obj) { return obj[p]; };
exports.prop = prop;
//# sourceMappingURL=utils.js.map