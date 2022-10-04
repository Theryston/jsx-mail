"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommandFromPreload = exports.loadCommandFromFile = void 0;
var path = require("path");
var utils_1 = require("../toolbox/utils");
var command_1 = require("../domain/command");
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
var module_loader_1 = require("./module-loader");
/**
 * Loads the command from the given file.
 *
 * @param file      The full path to the file to load.
 * @return The loaded command.
 */
function loadCommandFromFile(file, options) {
    if (options === void 0) { options = {}; }
    var command = new command_1.Command();
    // sanity check the input
    if (string_tools_1.strings.isBlank(file)) {
        throw new Error("Error: couldn't load command (file is blank): ".concat(file));
    }
    // not a file?
    if (filesystem_tools_1.filesystem.isNotFile(file)) {
        throw new Error("Error: couldn't load command (this isn't a file): ".concat(file));
    }
    // remember the file
    command.file = file;
    // default name is the name without the file extension
    command.name = filesystem_tools_1.filesystem.inspect(file).name.split('.')[0];
    // strip the extension from the end of the commandPath
    command.commandPath = (options.commandPath || (0, utils_1.last)(file.split('commands' + path.sep)).split(path.sep)).map(function (f) {
        return ["".concat(command.name, ".js"), "".concat(command.name, ".ts")].includes(f) ? command.name : f;
    });
    // if the last two elements of the commandPath are the same, remove the last one
    var lastElems = (0, utils_1.takeLast)(2, command.commandPath);
    if (lastElems.length === 2 && lastElems[0] === lastElems[1]) {
        command.commandPath = command.commandPath.slice(0, -1);
    }
    // require in the module -- best chance to bomb is here
    var commandModule = (0, module_loader_1.loadModule)(file);
    // if they use `export default` rather than `module.exports =`, we extract that
    commandModule = commandModule.default || commandModule;
    // is it a valid commandModule?
    var valid = commandModule && typeof commandModule === 'object' && typeof commandModule.run === 'function';
    if (valid) {
        command.name = commandModule.name || (0, utils_1.last)(command.commandPath);
        command.description = commandModule.description;
        command.hidden = Boolean(commandModule.hidden);
        command.alias = (0, utils_1.reject)(utils_1.isNil, (0, utils_1.is)(Array, commandModule.alias) ? commandModule.alias : [commandModule.alias]);
        command.run = commandModule.run;
    }
    else {
        throw new Error("Error: Couldn't load command ".concat(command.name, " -- needs a \"run\" property with a function."));
    }
    return command;
}
exports.loadCommandFromFile = loadCommandFromFile;
function loadCommandFromPreload(preload) {
    var command = new command_1.Command();
    command.name = preload.name;
    command.description = preload.description;
    command.hidden = Boolean(preload.hidden);
    command.alias = preload.alias;
    command.run = preload.run;
    command.file = null;
    command.dashed = Boolean(preload.dashed);
    command.commandPath = preload.commandPath || [preload.name];
    return command;
}
exports.loadCommandFromPreload = loadCommandFromPreload;
//# sourceMappingURL=command-loader.js.map