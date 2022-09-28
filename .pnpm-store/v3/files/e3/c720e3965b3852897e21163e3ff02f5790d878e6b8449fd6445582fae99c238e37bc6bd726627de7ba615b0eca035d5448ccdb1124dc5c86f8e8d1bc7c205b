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
exports.createParams = exports.parseParams = void 0;
var utils_1 = require("./utils");
var COMMAND_DELIMITER = ' ';
/**
 * Parses given command arguments into a more useful format.
 *
 * @param commandArray Command string or list of command parts.
 * @param extraOpts Extra options.
 * @returns Normalized parameters.
 */
function parseParams(commandArray, extraOpts) {
    if (extraOpts === void 0) { extraOpts = {}; }
    var yargsParse = require('yargs-parser');
    // use the command line args if not passed in
    if ((0, utils_1.is)(String, commandArray)) {
        commandArray = commandArray.split(COMMAND_DELIMITER);
    }
    // we now know it's a string[], so keep TS happy
    commandArray = commandArray;
    // remove the first 2 args if it comes from process.argv
    if ((0, utils_1.equals)(commandArray, process.argv)) {
        commandArray = commandArray.slice(2);
    }
    // chop it up yargsParse!
    var parsed = yargsParse(commandArray);
    var array = parsed._.slice();
    delete parsed._;
    var options = __assign(__assign({}, parsed), extraOpts);
    return { array: array, options: options };
}
exports.parseParams = parseParams;
/**
 * Constructs the parameters object.
 *
 * @param params Provided parameters
 * @return An object with normalized parameters
 */
function createParams(params) {
    // make a copy of the args so we can mutate it
    var array = params.array.slice();
    var first = array[0], second = array[1], third = array[2];
    // the string is the rest of the words
    var finalString = array.join(' ');
    // :shipit:
    return __assign(__assign({}, params), { array: array, first: first, second: second, third: third, string: finalString });
}
exports.createParams = createParams;
//# sourceMappingURL=parameter-tools.js.map