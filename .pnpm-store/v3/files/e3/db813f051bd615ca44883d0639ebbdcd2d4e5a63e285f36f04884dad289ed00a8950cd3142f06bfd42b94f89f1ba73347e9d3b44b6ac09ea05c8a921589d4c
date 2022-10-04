"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strings = void 0;
var utils_1 = require("./utils");
var camelCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.camelcase').apply(void 0, args);
};
var kebabCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.kebabcase').apply(void 0, args);
};
var lowerCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.lowercase').apply(void 0, args);
};
var lowerFirst = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.lowerfirst').apply(void 0, args);
};
var pad = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.pad').apply(void 0, args);
};
var padEnd = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.padend').apply(void 0, args);
};
var padStart = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.padstart').apply(void 0, args);
};
var repeat = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.repeat').apply(void 0, args);
};
var snakeCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.snakecase').apply(void 0, args);
};
var startCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.startcase').apply(void 0, args);
};
var trim = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.trim').apply(void 0, args);
};
var trimEnd = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.trimend').apply(void 0, args);
};
var trimStart = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.trimstart').apply(void 0, args);
};
var upperCase = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.uppercase').apply(void 0, args);
};
var upperFirst = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return require('lodash.upperfirst').apply(void 0, args);
};
var pluralize = function (word, count, inclusive) { return require('pluralize')(word, count, inclusive); };
pluralize.plural = function (word) { return require('pluralize').plural(word); };
pluralize.singular = function (word) { return require('pluralize').singular(word); };
pluralize.addPluralRule = function (rule, replacement) {
    return require('pluralize').addPluralRule(rule, replacement);
};
pluralize.addSingularRule = function (rule, replacement) {
    return require('pluralize').addSingularRule(rule, replacement);
};
pluralize.addIrregularRule = function (single, plural) { return require('pluralize').addIrregularRule(single, plural); };
pluralize.addUncountableRule = function (word) { return require('pluralize').addUncountableRule(word); };
pluralize.isPlural = function (word) { return require('pluralize').isPlural(word); };
pluralize.isSingular = function (word) { return require('pluralize').isSingular(word); };
/**
 * Is this not a string?
 *
 * @param value The value to check
 * @return True if it is not a string, otherwise false
 */
function isNotString(value) {
    return !(0, utils_1.is)(String, value);
}
/**
 * Is this value a blank string?
 *
 * @param value The value to check.
 * @returns True if it was, otherwise false.
 */
function isBlank(value) {
    return isNotString(value) || trim(value) === '';
}
/**
 * Returns the value it is given
 *
 * @param value
 * @returns the value.
 */
function identity(value) {
    return value;
}
/**
 * Converts the value ToPascalCase.
 *
 * @param value The string to convert
 * @returns PascalCase string.
 */
function pascalCase(value) {
    return upperFirst(camelCase(value));
}
exports.strings = {
    isNotString: isNotString,
    isBlank: isBlank,
    identity: identity,
    pascalCase: pascalCase,
    camelCase: camelCase,
    kebabCase: kebabCase,
    lowerCase: lowerCase,
    lowerFirst: lowerFirst,
    pad: pad,
    padEnd: padEnd,
    padStart: padStart,
    repeat: repeat,
    snakeCase: snakeCase,
    startCase: startCase,
    trim: trim,
    trimEnd: trimEnd,
    trimStart: trimStart,
    upperCase: upperCase,
    upperFirst: upperFirst,
    pluralize: pluralize,
    plural: pluralize.plural,
    singular: pluralize.singular,
    addPluralRule: pluralize.addPluralRule,
    addSingularRule: pluralize.addSingularRule,
    addIrregularRule: pluralize.addIrregularRule,
    addUncountableRule: pluralize.addUncountableRule,
    isPlural: pluralize.isPlural,
    isSingular: pluralize.isSingular,
};
//# sourceMappingURL=string-tools.js.map