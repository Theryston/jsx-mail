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
exports.Runtime = void 0;
// helpers
var path_1 = require("path");
var utils_1 = require("../toolbox/utils");
// domains
var command_1 = require("../domain/command");
// loaders
var command_loader_1 = require("../loaders/command-loader");
var config_loader_1 = require("../loaders/config-loader");
var plugin_loader_1 = require("../loaders/plugin-loader");
// tools
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
// the special run function
var run_1 = require("./run");
/**
 * Loads plugins, extensions, and invokes the intended command.
 */
var Runtime = /** @class */ (function () {
    /**
     * Create and initialize an empty Runtime.
     */
    function Runtime(brand) {
        this.plugins = [];
        this.extensions = [];
        this.commands = [];
        this.defaults = {};
        this.defaultPlugin = null;
        this.defaultCommand = null;
        this.config = {};
        this.checkUpdate = false;
        this.brand = brand;
        this.run = run_1.run; // awkward because node.js doesn't support async-based class functions yet.
    }
    /**
     * Adds the core extensions.  These provide the basic features
     * available in gluegun, but follow a similar method
     * for extending the core as 3rd party extensions do.
     */
    Runtime.prototype.addCoreExtensions = function (exclude) {
        var _this = this;
        if (exclude === void 0) { exclude = []; }
        var coreExtensions = [
            'meta',
            'strings',
            'print',
            'filesystem',
            'semver',
            'system',
            'prompt',
            'http',
            'template',
            'patching',
            'package-manager',
        ];
        coreExtensions.forEach(function (ex) {
            if (!exclude.includes(ex)) {
                _this.addExtension(ex, require("../core-extensions/".concat(ex, "-extension")));
            }
        });
    };
    /**
     * Adds a command to the runtime.
     *
     * @param command A GluegunCommand.
     * @returns This runtime.
     */
    Runtime.prototype.addCommand = function (command) {
        var _this = this;
        if (!command.plugin && !this.defaultPlugin) {
            throw new Error("Can't add command ".concat(command.name, " - no default plugin. You may have forgotten a src() on your runtime."));
        }
        // convert the command to a real Command object (if needed)
        var newCommand = (0, utils_1.is)(command_1.Command, command) ? command : (0, command_loader_1.loadCommandFromPreload)(command);
        // set the command's plugin reference to the defaultPlugin
        // if it doesn't already have one
        if (!newCommand.plugin) {
            newCommand.plugin = this.defaultPlugin;
            this.defaultPlugin.commands.push(newCommand);
        }
        if (newCommand.name === this.brand) {
            // we want to keep a reference to the default command, so we can find it later
            this.defaultCommand = newCommand;
        }
        // add the command to the runtime (if it isn't already there)
        if (!this.commands.find(function (c) { return c.commandPath === newCommand.commandPath; })) {
            this.commands.push(newCommand);
        }
        // now sort the commands
        this.commands.sort(function (a, b) {
            if (a === _this.defaultCommand)
                return -1;
            if (b === _this.defaultCommand)
                return 1;
            if (a.plugin === _this.defaultPlugin)
                return -1;
            if (b.plugin === _this.defaultPlugin)
                return 1;
            return 0;
        });
        return this;
    };
    /**
     * Adds an extension so it is available when commands run. They usually live
     * as the given name on the toolbox object passed to commands, but are able
     * to manipulate the toolbox object however they want. The second
     * parameter is a function that allows the extension to attach itself.
     *
     * @param name The toolbox property name.
     * @param setup The setup function.
     * @returns This runtime.
     */
    Runtime.prototype.addExtension = function (name, setup) {
        setup = setup.default || setup;
        this.extensions.push({ name: name, setup: setup });
        return this;
    };
    /**
     * Loads a plugin from a directory and sets it as the default.
     *
     * @param directory The directory to load from.
     * @param options Additional loading options.
     * @returns This runtime.
     */
    Runtime.prototype.addDefaultPlugin = function (directory, options) {
        if (options === void 0) { options = {}; }
        this.defaultPlugin = this.addPlugin(directory, __assign({ required: true, name: this.brand }, options));
        // load config and set defaults
        var loadedConfig = (0, config_loader_1.loadConfig)(this.brand, directory) || {};
        var defaults = loadedConfig.defaults, config = __rest(loadedConfig, ["defaults"]);
        this.defaults = defaults;
        this.config = config;
        return this;
    };
    /**
     * Loads a plugin from a directory.
     *
     * @param directory The directory to load from.
     * @param options Additional loading options.
     * @returns The plugin that was created or null.
     */
    Runtime.prototype.addPlugin = function (directory, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!filesystem_tools_1.filesystem.isDirectory(directory)) {
            if (options.required) {
                throw new Error("Error: couldn't load plugin (not a directory): ".concat(directory));
            }
            else {
                return undefined;
            }
        }
        var plugin = (0, plugin_loader_1.loadPluginFromDirectory)((0, path_1.resolve)(directory), {
            brand: this.brand,
            hidden: options.hidden,
            name: options.name,
            commandFilePattern: options.commandFilePattern,
            extensionFilePattern: options.extensionFilePattern,
            preloadedCommands: options.preloadedCommands,
        });
        this.plugins.push(plugin);
        plugin.extensions.forEach(function (extension) { return _this.addExtension(extension.name, extension.setup); });
        plugin.commands.forEach(function (command) { return _this.addCommand(command); });
        return plugin;
    };
    /**
     * Loads a bunch of plugins from the immediate sub-directories of a directory.
     *
     * @param directory The directory to grab from.
     * @param options Addition loading options.
     * @return This runtime.
     */
    Runtime.prototype.addPlugins = function (directory, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (string_tools_1.strings.isBlank(directory) || !filesystem_tools_1.filesystem.isDirectory(directory))
            return [];
        // find matching filesystem.subdirectories
        var subdirs = filesystem_tools_1.filesystem.subdirectories(directory, false, options.matching);
        // load each one using `this.plugin`
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var matching = options.matching, otherOptions = __rest(options, ["matching"]); // remove "matching"
        return subdirs.map(function (dir) { return _this.addPlugin(dir, otherOptions); });
    };
    return Runtime;
}());
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map