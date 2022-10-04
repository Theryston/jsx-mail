"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommand = void 0;
var command_1 = require("../domain/command");
var utils_1 = require("../toolbox/utils");
/**
 * This function performs some somewhat complex logic to find a command for a given
 * set of parameters and plugins.
 *
 * @param runtime The current runtime.
 * @param parameters The parameters passed in
 * @returns object with plugin, command, and array
 */
function findCommand(runtime, parameters) {
    // the commandPath, which could be something like:
    // > movie list actors 2015
    // [ 'list', 'actors', '2015' ]
    // here, the '2015' might not actually be a command, but it's part of it
    var commandPath = parameters.array;
    // the part of the commandPath that doesn't match a command
    // in the above example, it will end up being [ '2015' ]
    var tempPathRest = commandPath;
    var commandPathRest = tempPathRest;
    // a fallback command
    var commandNotFound = new command_1.Command({
        run: function (_toolbox) {
            throw new Error("Couldn't find that command, and no default command set.");
        },
    });
    // the resolved command will live here
    // start by setting it to the default command, in case we don't find one
    var targetCommand = runtime.defaultCommand || commandNotFound;
    // if the commandPath is empty, it could be a dashed command, like --help
    if (commandPath.length === 0) {
        targetCommand = findDashedCommand(runtime.commands, parameters.options) || targetCommand;
    }
    // store the resolved path as we go
    var resolvedPath = [];
    // we loop through each segment of the commandPath, looking for aliases among
    // parent commands, and expand those.
    commandPath.forEach(function (currName) {
        // cut another piece off the front of the commandPath
        tempPathRest = tempPathRest.slice(1);
        // find a command that fits the previous path + currentName, which can be an alias
        var segmentCommand = runtime.commands
            .slice() // dup so we keep the original order
            .sort(sortCommands)
            .find(function (command) { return (0, utils_1.equals)(command.commandPath.slice(0, -1), resolvedPath) && command.matchesAlias(currName); });
        if (segmentCommand) {
            // found another candidate as the "endpoint" command
            targetCommand = segmentCommand;
            // since we found a command, the "commandPathRest" gets updated to the tempPathRest
            commandPathRest = tempPathRest;
            // add the current command to the resolvedPath
            resolvedPath = resolvedPath.concat([segmentCommand.name]);
        }
        else {
            // no command found, let's add the segment as-is to the command path
            resolvedPath = resolvedPath.concat([currName]);
        }
    }, []);
    return { command: targetCommand, array: commandPathRest };
}
exports.findCommand = findCommand;
// sorts shortest to longest commandPaths, so we always check the shortest ones first
function sortCommands(a, b) {
    return a.commandPath.length < b.commandPath.length ? -1 : 1;
}
// finds dashed commands
function findDashedCommand(commands, options) {
    var dashedOptions = Object.keys(options).filter(function (k) { return options[k] === true; });
    return commands.filter(function (c) { return c.dashed; }).find(function (c) { return c.matchesAlias(dashedOptions); });
}
//# sourceMappingURL=runtime-find-command.js.map