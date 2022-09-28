"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesystem = void 0;
var os = require("os");
var pathlib = require("path");
var jetpack = require("fs-jetpack");
var fs_1 = require("fs");
/**
 * Is this a file?
 *
 * @param path The filename to check.
 * @returns `true` if the file exists and is a file, otherwise `false`.
 */
function isFile(path) {
    return jetpack.exists(path) === 'file';
}
/**
 * Is this not a file?
 *
 * @param path The filename to check
 * @return `true` if the file doesn't exist.
 */
var isNotFile = function (path) { return !isFile(path); };
/**
 * Is this a directory?
 *
 * @param path The directory to check.
 * @returns True/false -- does the directory exist?
 */
function isDirectory(path) {
    return jetpack.exists(path) === 'dir';
}
/**
 * Is this not a directory?
 *
 * @param path The directory to check.
 * @return `true` if the directory does not exist, otherwise false.
 */
var isNotDirectory = function (path) { return !isDirectory(path); };
/**
 * Gets the immediate subdirectories.
 *
 * @param path Path to a directory to check.
 * @param isRelative Return back the relative directory?
 * @param matching   A jetpack matching filter
 * @return A list of directories
 */
function subdirectories(path, isRelative, matching, _symlinks) {
    if (isRelative === void 0) { isRelative = false; }
    if (matching === void 0) { matching = '*'; }
    if (_symlinks === void 0) { _symlinks = false; }
    var strings = require('./string-tools').strings;
    if (strings.isBlank(path) || !isDirectory(path))
        return [];
    var dirs = jetpack.cwd(path).find({
        matching: matching,
        directories: true,
        recursive: false,
        files: false,
    });
    if (isRelative) {
        return dirs;
    }
    else {
        return dirs.map(function (dir) { return pathlib.join(path, dir); });
    }
}
var filesystem = __assign({ chmodSync: fs_1.chmodSync, eol: os.EOL, homedir: os.homedir, separator: pathlib.sep, // path separator
    subdirectories: subdirectories, // retrieve subdirectories
    isFile: isFile, isNotFile: isNotFile, isDirectory: isDirectory, isNotDirectory: isNotDirectory, resolve: pathlib.resolve }, jetpack);
exports.filesystem = filesystem;
//# sourceMappingURL=filesystem-tools.js.map