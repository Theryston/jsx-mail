"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.system = void 0;
var utils_1 = require("./utils");
/**
 * Executes a commandline program asynchronously.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
function run(commandLine, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var trimmer, trim, nodeOptions;
        return __generator(this, function (_a) {
            trimmer = options && options.trim ? function (s) { return s.trim(); } : function (s) { return s; };
            trim = options.trim, nodeOptions = __rest(options, ["trim"]);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var exec = require('child_process').exec;
                    exec(commandLine, nodeOptions, function (error, stdout, stderr) {
                        if (error) {
                            error.stdout = stdout;
                            error.stderr = stderr;
                            return reject(error);
                        }
                        resolve(trimmer(stdout || ''));
                    });
                })];
        });
    });
}
/**
 * Executes a commandline via execa.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns Promise with result.
 */
function exec(commandLine, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var args = commandLine.split(' ');
                    require('execa')((0, utils_1.head)(args), (0, utils_1.tail)(args), options)
                        .then(function (result) { return resolve(result.stdout); })
                        .catch(function (error) { return reject(error); });
                })];
        });
    });
}
/**
 * Uses cross-spawn to run a process.
 *
 * @param commandLine The command line to execute.
 * @param options Additional child_process options for node.
 * @returns The response code.
 */
function spawn(commandLine, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, _reject) {
                    var args = commandLine.split(' ');
                    var spawned = require('cross-spawn')((0, utils_1.head)(args), (0, utils_1.tail)(args), options);
                    var result = {
                        stdout: null,
                        status: null,
                        error: null,
                    };
                    if (spawned.stdout) {
                        spawned.stdout.on('data', function (data) {
                            if ((0, utils_1.isNil)(result.stdout)) {
                                result.stdout = data;
                            }
                            else {
                                result.stdout += data;
                            }
                        });
                    }
                    spawned.on('close', function (code) {
                        result.status = code;
                        resolve(result);
                    });
                    spawned.on('error', function (err) {
                        result.error = err;
                        resolve(result);
                    });
                })];
        });
    });
}
/**
 * Finds the location of the path.
 *
 * @param command The name of program you're looking for.
 * @return The full path or null.
 */
function which(command) {
    return require('which').sync(command, { nothrow: true });
}
/**
 * Starts a timer used for measuring durations.
 *
 * @return A function that when called will return the elapsed duration in milliseconds.
 */
function startTimer() {
    var started = process.uptime();
    return function () { return Math.floor((process.uptime() - started) * 1000); }; // uptime gives us seconds
}
var system = { exec: exec, run: run, spawn: spawn, which: which, startTimer: startTimer };
exports.system = system;
//# sourceMappingURL=system-tools.js.map