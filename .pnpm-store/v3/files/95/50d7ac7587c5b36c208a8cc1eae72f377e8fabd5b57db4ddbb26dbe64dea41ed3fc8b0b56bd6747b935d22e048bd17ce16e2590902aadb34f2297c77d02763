"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPluginFromDirectory = void 0;
var path = require("path");
var jetpack = require("fs-jetpack");
var plugin_1 = require("../domain/plugin");
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
var command_loader_1 = require("./command-loader");
var config_loader_1 = require("./config-loader");
var extension_loader_1 = require("./extension-loader");
/**
 * Loads a plugin from a directory.
 *
 * @param directory The full path to the directory to load.
 * @param options Additional options to customize the loading process.
 */
function loadPluginFromDirectory(directory, options) {
    if (options === void 0) { options = {}; }
    var plugin = new plugin_1.Plugin();
    var _a = options.brand, brand = _a === void 0 ? 'gluegun' : _a, _b = options.commandFilePattern, commandFilePattern = _b === void 0 ? ["*.{js,ts}", "!*.test.{js,ts}"] : _b, _c = options.extensionFilePattern, extensionFilePattern = _c === void 0 ? ["*.{js,ts}", "!*.test.{js,ts}"] : _c, _d = options.hidden, hidden = _d === void 0 ? false : _d, name = options.name;
    plugin.hidden = Boolean(options.hidden);
    if (!string_tools_1.strings.isBlank(name)) {
        plugin.name = name;
    }
    // directory check
    if (filesystem_tools_1.filesystem.isNotDirectory(directory)) {
        throw new Error("Error: couldn't load plugin (not a directory): ".concat(directory));
    }
    plugin.directory = directory;
    // the directory is the default name (unless we were told what it was)
    if (string_tools_1.strings.isBlank(name)) {
        plugin.name = jetpack.inspect(directory).name;
    }
    var jetpackPlugin = jetpack.cwd(plugin.directory);
    // load any default commands passed in
    plugin.commands = (options.preloadedCommands || []).map(command_loader_1.loadCommandFromPreload);
    // load the commands found in the commands sub-directory
    var commandSearchDirectories = ['commands', 'build/commands'];
    commandSearchDirectories.forEach(function (dir) {
        if (jetpackPlugin.exists(dir) === 'dir') {
            var commands = jetpackPlugin.cwd(dir).find({ matching: commandFilePattern, recursive: true });
            plugin.commands = plugin.commands.concat(commands.map(function (file) { return (0, command_loader_1.loadCommandFromFile)(path.join(directory, dir, file)); }));
        }
    });
    // load the extensions found in the extensions sub-directory
    var extensionSearchDirectories = ['extensions', 'build/extensions'];
    extensionSearchDirectories.forEach(function (dir) {
        if (jetpackPlugin.exists(dir) === 'dir') {
            var extensions = jetpackPlugin.cwd(dir).find({ matching: extensionFilePattern, recursive: false });
            plugin.extensions = plugin.extensions.concat(extensions.map(function (file) { return (0, extension_loader_1.loadExtensionFromFile)("".concat(directory, "/").concat(dir, "/").concat(file)); }));
        }
    });
    // load config using cosmiconfig
    var config = (0, config_loader_1.loadConfig)(plugin.name, directory);
    // set the name if we have one (unless we were told what it was)
    plugin.name = config.name || plugin.name;
    plugin[brand] = config[brand];
    plugin.defaults = config.defaults || {};
    plugin.description = config.description;
    // set the hidden bit
    if (hidden) {
        plugin.commands.forEach(function (command) { return (command.hidden = true); });
    }
    // set all commands to reference their parent plugin
    plugin.commands.forEach(function (c) { return (c.plugin = plugin); });
    // sort plugin commands alphabetically
    plugin.commands = plugin.commands.sort(function (a, b) { return (a.commandPath.join(' ') < b.commandPath.join(' ') ? -1 : 1); });
    return plugin;
}
exports.loadPluginFromDirectory = loadPluginFromDirectory;
//# sourceMappingURL=plugin-loader.js.map