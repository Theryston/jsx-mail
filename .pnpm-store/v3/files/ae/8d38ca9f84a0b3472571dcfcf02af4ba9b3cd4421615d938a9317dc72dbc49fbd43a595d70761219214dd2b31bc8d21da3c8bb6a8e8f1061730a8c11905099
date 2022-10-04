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
Object.defineProperty(exports, "__esModule", { value: true });
exports.patching = exports.patchString = exports.readFile = exports.patch = exports.replace = exports.append = exports.prepend = exports.update = exports.exists = void 0;
var utils_1 = require("./utils");
var filesystem_tools_1 = require("./filesystem-tools");
/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
function exists(filename, findPattern) {
    return __awaiter(this, void 0, void 0, function () {
        var patternIsString, contents;
        return __generator(this, function (_a) {
            // sanity check the filename
            if (!(0, utils_1.is)(String, filename) || filesystem_tools_1.filesystem.isNotFile(filename))
                return [2 /*return*/, false
                    // sanity check the findPattern
                ];
            patternIsString = typeof findPattern === 'string';
            if (!(findPattern instanceof RegExp) && !patternIsString)
                return [2 /*return*/, false
                    // read from jetpack -- they guard against a lot of the edge
                    // cases and return nil if problematic
                ];
            contents = filesystem_tools_1.filesystem.read(filename);
            // only let the strings pass
            if (!(0, utils_1.is)(String, contents))
                return [2 /*return*/, false
                    // do the appropriate check
                ];
            // do the appropriate check
            return [2 /*return*/, isPatternIncluded(contents, findPattern)];
        });
    });
}
exports.exists = exists;
/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
function update(filename, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var contents, mutatedContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readFile(filename)
                    // let the caller mutate the contents in memory
                ];
                case 1:
                    contents = _a.sent();
                    mutatedContents = callback(contents);
                    if (!(mutatedContents !== false)) return [3 /*break*/, 3];
                    return [4 /*yield*/, filesystem_tools_1.filesystem.writeAsync(filename, mutatedContents, { atomic: true })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, mutatedContents];
            }
        });
    });
}
exports.update = update;
/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
function prepend(filename, prependedData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, update(filename, function (data) { return prependedData + data; })];
        });
    });
}
exports.prepend = prepend;
/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
function append(filename, appendedData) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, update(filename, function (data) { return data + appendedData; })];
        });
    });
}
exports.append = append;
/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
function replace(filename, oldContent, newContent) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, update(filename, function (data) { return data.replace(oldContent, newContent); })];
        });
    });
}
exports.replace = replace;
/**
 * Conditionally places a string into a file before or after another string,
 * or replacing another string, or deletes a string. Async.
 *
 * @param filename        File to be patched
 * @param opts            Options
 * @param opts.insert     String to be inserted
 * @param opts.before     Insert before this string
 * @param opts.after      Insert after this string
 * @param opts.replace    Replace this string
 * @param opts.delete     Delete this string
 * @param opts.force      Write even if it already exists
 *
 * @example
 *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
function patch(filename) {
    var opts = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        opts[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, update(filename, function (data) {
                    var result = opts.reduce(function (updatedData, opt) { return patchString(updatedData, opt) || updatedData; }, data);
                    return result !== data && result;
                })];
        });
    });
}
exports.patch = patch;
function readFile(filename) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // bomb if the file doesn't exist
            if (!filesystem_tools_1.filesystem.isFile(filename))
                throw new Error("file not found ".concat(filename));
            // check type of file (JSON or not)
            if (filename.endsWith('.json')) {
                return [2 /*return*/, filesystem_tools_1.filesystem.readAsync(filename, 'json')];
            }
            else {
                return [2 /*return*/, filesystem_tools_1.filesystem.readAsync(filename, 'utf8')];
            }
            return [2 /*return*/];
        });
    });
}
exports.readFile = readFile;
function patchString(data, opts) {
    if (opts === void 0) { opts = {}; }
    // Already includes string, and not forcing it
    if (isPatternIncluded(data, opts.insert) && !opts.force)
        return false;
    // delete <string> is the same as replace <string> + insert ''
    var replaceString = opts.delete || opts.replace;
    if (replaceString) {
        if (!isPatternIncluded(data, replaceString))
            return false;
        // Replace matching string with new string or nothing if nothing provided
        return data.replace(replaceString, "".concat(opts.insert || ''));
    }
    else {
        return insertNextToPattern(data, opts);
    }
}
exports.patchString = patchString;
function insertNextToPattern(data, opts) {
    // Insert before/after a particular string
    var findPattern = opts.before || opts.after;
    // sanity check the findPattern
    var patternIsString = typeof findPattern === 'string';
    if (!(findPattern instanceof RegExp) && !patternIsString)
        return false;
    var isPatternFound = isPatternIncluded(data, findPattern);
    if (!isPatternFound)
        return false;
    var originalString = patternIsString ? findPattern : data.match(findPattern)[0];
    var newContents = opts.after ? "".concat(originalString).concat(opts.insert || '') : "".concat(opts.insert || '').concat(originalString);
    return data.replace(findPattern, newContents);
}
function isPatternIncluded(data, findPattern) {
    if (!findPattern)
        return false;
    return typeof findPattern === 'string' ? data.includes(findPattern) : findPattern.test(data);
}
var patching = { update: update, append: append, prepend: prepend, replace: replace, patch: patch, exists: exists };
exports.patching = patching;
//# sourceMappingURL=patching-tools.js.map