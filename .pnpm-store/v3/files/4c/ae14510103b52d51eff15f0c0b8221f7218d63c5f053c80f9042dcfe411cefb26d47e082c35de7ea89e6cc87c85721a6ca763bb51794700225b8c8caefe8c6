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
exports.print = void 0;
var CLITable = require("cli-table3");
var importedColors = require("colors/safe");
var meta_tools_1 = require("./meta-tools");
var utils_1 = require("./utils");
// We're extending `colors` with a few more attributes
var colors = importedColors;
colors.setTheme({
    highlight: 'cyan',
    info: 'reset',
    warning: 'yellow',
    success: 'green',
    error: 'red',
    line: 'grey',
    muted: 'grey',
});
// Generate array of arrays of the data rows for length checking
// const getRows = t => times(flip(prop)(t), t.length)
var getRows = function (t) { return (0, utils_1.times)(function (i) { return t[i]; }, t.length); };
var CLI_TABLE_COMPACT = {
    top: '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    bottom: '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    left: ' ',
    'left-mid': '',
    mid: '',
    'mid-mid': '',
    right: '',
    'right-mid': '',
    middle: ' ',
};
var CLI_TABLE_MARKDOWN = __assign(__assign({}, CLI_TABLE_COMPACT), { left: '|', right: '|', middle: '|' });
/**
 * Print a blank line.
 */
function newline() {
    console.log('');
}
/**
 * Prints a divider line
 */
function divider() {
    console.log(colors.line('---------------------------------------------------------------'));
}
/**
 * Returns an array of the column widths.
 *
 * @param cliTable Data table.
 * @returns Array of column widths
 */
function findWidths(cliTable) {
    return [cliTable.options.head]
        .concat(getRows(cliTable))
        .reduce(function (colWidths, row) { return row.map(function (str, i) { return Math.max("".concat(str).length + 1, colWidths[i] || 1); }); }, []);
}
/**
 * Returns an array of column dividers based on column widths, taking possible
 * paddings into account.
 *
 * @param cliTable Data table.
 * @returns Array of properly sized column dividers.
 */
function columnHeaderDivider(cliTable, style) {
    if (style === void 0) { style = {}; }
    var padding = (style['padding-left'] || 0) + (style['padding-right'] || 0);
    return findWidths(cliTable).map(function (w) { return Array(w + padding).join('-'); });
}
/**
 * Resets the padding of a table.
 *
 * @param cliTable Data table.
 */
function resetTablePadding(cliTable) {
    var style = cliTable.options.style;
    if (style) {
        style['padding-left'] = 1;
        style['padding-right'] = 1;
    }
}
/**
 * Prints an object to table format.  The values will already be
 * stringified.
 *
 * @param object The object to turn into a table.
 */
function table(data, options) {
    if (options === void 0) { options = {}; }
    var t;
    switch (options.format) {
        case 'markdown':
            // eslint-disable-next-line no-case-declarations
            var header = data.shift();
            t = new CLITable({
                head: header,
                chars: CLI_TABLE_MARKDOWN,
                style: options.style,
            });
            t.push.apply(t, data);
            t.unshift(columnHeaderDivider(t, options.style));
            resetTablePadding(t);
            break;
        case 'lean':
            t = new CLITable({
                style: options.style,
            });
            t.push.apply(t, data);
            break;
        default:
            t = new CLITable({
                chars: CLI_TABLE_COMPACT,
                style: options.style,
            });
            t.push.apply(t, data);
    }
    console.log(t.toString());
}
/**
 * Prints text without theming.
 *
 * Use this when you're writing stuff outside the toolbox of our
 * printing scheme.  hint: rarely.
 *
 * @param message The message to write.
 */
function fancy(message) {
    console.log(message);
}
/**
 * Writes a normal information message.
 *
 * This is the default type you should use.
 *
 * @param message The message to show.
 */
function info(message) {
    console.log(colors.info(message));
}
/**
 * Writes an error message.
 *
 * This is when something horribly goes wrong.
 *
 * @param message The message to show.
 */
function error(message) {
    console.log(colors.error(message));
}
/**
 * Writes a warning message.
 *
 * This is when the user might not be getting what they're expecting.
 *
 * @param message The message to show.
 */
function warning(message) {
    console.log(colors.warning(message));
}
/**
 * Writes a debug message.
 *
 * This is for devs only.
 *
 * @param message The message to show.
 */
function debug(message, title) {
    if (title === void 0) { title = 'DEBUG'; }
    var topLine = "vvv -----[ ".concat(title, " ]----- vvv");
    var botLine = "^^^ -----[ ".concat(title, " ]----- ^^^");
    console.log(colors.rainbow(topLine));
    console.log(message);
    console.log(colors.rainbow(botLine));
}
/**
 * Writes a success message.
 *
 * When something is successful.  Use sparingly.
 *
 * @param message The message to show.
 */
function success(message) {
    console.log(colors.success(message));
}
/**
 * Writes a highlighted message.
 *
 * To draw attention to specific lines.  Use sparingly.
 *
 * @param message The message to show.
 */
function highlight(message) {
    console.log(colors.highlight(message));
}
/**
 * Writes a muted message.
 *
 * For ancillary info, something that's not the star of the show.
 *
 * @param message The message to show.
 */
function muted(message) {
    console.log(colors.muted(message));
}
/**
 * Creates a spinner and starts it up.
 *
 * @param config The text for the spinner or an ora configuration object.
 * @returns The spinner.
 */
function spin(config) {
    return require('ora')(config || '').start();
}
/**
 * Prints the list of commands.
 *
 * @param toolbox The toolbox that was used
 * @param commandRoot Optional, only show commands with this root
 */
function printCommands(toolbox, commandRoot) {
    var data = (0, meta_tools_1.commandInfo)(toolbox, commandRoot);
    newline(); // a spacer
    table(data); // the data
}
function printHelp(toolbox) {
    var brand = toolbox.runtime.brand;
    info("".concat(brand, " version ").concat(toolbox.meta.version()));
    printCommands(toolbox);
}
var checkmark = colors.success('✔︎');
var xmark = colors.error('ⅹ');
var print = {
    colors: colors,
    newline: newline,
    divider: divider,
    findWidths: findWidths,
    columnHeaderDivider: columnHeaderDivider,
    table: table,
    fancy: fancy,
    info: info,
    error: error,
    warning: warning,
    debug: debug,
    success: success,
    highlight: highlight,
    muted: muted,
    spin: spin,
    printCommands: printCommands,
    printHelp: printHelp,
    checkmark: checkmark,
    xmark: xmark,
};
exports.print = print;
//# sourceMappingURL=print-tools.js.map