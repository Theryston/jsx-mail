"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.Builder = void 0;
var runtime_1 = require("../runtime/runtime");
var help_1 = require("../core-commands/help");
var default_1 = require("../core-commands/default");
var version_1 = require("../core-commands/version");
/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
var Builder = /** @class */ (function () {
    function Builder(brand) {
        this.data = {
            brand: brand,
            excludes: [],
            commands: [],
            plugins: [],
            multiPlugins: [],
            checkUpdate: false,
        };
    }
    /**
     * Ideally named after the command line, the brand will be used
     * when searching for configuration files.
     *
     * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
     */
    Builder.prototype.brand = function (value) {
        this.data.brand = value;
        return this;
    };
    /**
     * Excludes core libraries if they're not needed, for performance reasons.
     */
    Builder.prototype.exclude = function (excludes) {
        this.data.excludes = excludes;
        return this;
    };
    /**
     * Specifies where the default commands and extensions live.
     *
     * @param value The path to the source directory.
     * @param options Additional plugin loading options.
     * @return self.
     */
    Builder.prototype.src = function (value, options) {
        if (options === void 0) { options = {}; }
        this.data.defaultPlugin = { value: value, options: options };
        return this;
    };
    /**
     * Add a plugin to the list.
     *
     * @param value   The plugin directory.
     * @param options Additional loading options.
     * @return self.
     */
    Builder.prototype.plugin = function (value, options) {
        if (options === void 0) { options = {}; }
        this.data.plugins.push({ value: value, options: options });
        return this;
    };
    /**
     * Add a plugin group to the list.
     *
     * @param value   The directory with sub-directories.
     * @param options Additional loading options.
     * @return self.
     */
    Builder.prototype.plugins = function (value, options) {
        if (options === void 0) { options = {}; }
        this.data.multiPlugins.push({ value: value, options: options });
        return this;
    };
    /**
     * Add a default help handler.
     * @param command An optional command function or object
     * @return self.
     */
    Builder.prototype.help = function (command) {
        command = command || help_1.default;
        if (typeof command === 'function') {
            command = { name: 'help', alias: ['h'], dashed: true, run: command };
        }
        return this.command(command);
    };
    /**
     * Add a default version handler.
     * @param command An optional command function or object
     * @return self.
     */
    Builder.prototype.version = function (command) {
        command = command || version_1.default;
        if (typeof command === 'function') {
            command = { name: 'version', alias: ['v'], dashed: true, run: command };
        }
        return this.command(command);
    };
    /**
     * Add a default command that runs if none other is found.
     * @param command An optional command function or object
     * @return self.
     */
    Builder.prototype.defaultCommand = function (command) {
        command = command || default_1.default;
        if (typeof command === 'function') {
            command = { run: command };
        }
        command.name = this.data.brand;
        this.data.defaultCommand = command;
        return this;
    };
    /**
     * Add a way to add an arbitrary command when building the CLI.
     * @param command command to add
     * @return self.
     */
    Builder.prototype.command = function (command) {
        this.data.commands.push(command);
        return this;
    };
    /**
     * Check for updates randomly.
     *
     * @param frequency % frequency of checking
     * @return self.
     */
    Builder.prototype.checkForUpdates = function (frequency) {
        this.data.checkUpdate = Math.floor(Math.random() * 100) + 1 < frequency;
        return this;
    };
    /**
     * Hand over the runtime.
     */
    Builder.prototype.create = function () {
        // create a runtime
        var runtime = new runtime_1.Runtime();
        // extract the data the builder has collected
        var _a = this.data, brand = _a.brand, excludes = _a.excludes, defaultCommand = _a.defaultCommand, defaultPlugin = _a.defaultPlugin, plugins = _a.plugins, multiPlugins = _a.multiPlugins, commands = _a.commands;
        // set the brand
        runtime.brand = brand;
        // load the core extensions, minus excludes
        runtime.addCoreExtensions(excludes);
        // add a default plugin
        if (defaultPlugin)
            runtime.addDefaultPlugin(defaultPlugin.value, defaultPlugin.options);
        // add other plugins, both singular and multiple
        plugins.forEach(function (p) { return runtime.addPlugin(p.value, p.options); });
        multiPlugins.forEach(function (mp) { return runtime.addPlugins(mp.value, mp.options); });
        // add a default command first
        if (defaultCommand)
            runtime.addCommand(defaultCommand);
        // add other commands
        commands.forEach(function (c) { return runtime.addCommand(c); });
        // check for updates
        runtime.checkUpdate = this.data.checkUpdate;
        return runtime;
    };
    return Builder;
}());
exports.Builder = Builder;
/**
 * Export it as a factory function.
 */
function build(brand) {
    return new Builder(brand);
}
exports.build = build;
//# sourceMappingURL=builder.js.map