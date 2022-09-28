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
exports.run = void 0;
var toolbox_1 = require("../domain/toolbox");
var parameter_tools_1 = require("../toolbox/parameter-tools");
var runtime_find_command_1 = require("./runtime-find-command");
var config_loader_1 = require("../loaders/config-loader");
/**
 * Runs a command.
 *
 * @param rawCommand Command string or array of strings.
 * @param extraOptions Additional options use to execute a command.
 * @return The Toolbox object indicating what happened.
 */
function run(rawCommand, extraOptions) {
    if (extraOptions === void 0) { extraOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var toolbox, _a, command, array, extensionSetupPromises, updateAvailable, _b, finalToolbox;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // use provided rawCommand or process arguments if none given
                    rawCommand = rawCommand || process.argv;
                    toolbox = new toolbox_1.EmptyToolbox();
                    // attach the runtime
                    toolbox.runtime = this;
                    // parse the parameters initially
                    toolbox.parameters = (0, parameter_tools_1.parseParams)(rawCommand, extraOptions);
                    _a = (0, runtime_find_command_1.findCommand)(this, toolbox.parameters), command = _a.command, array = _a.array;
                    // rebuild the parameters, now that we know the plugin and command
                    toolbox.parameters = (0, parameter_tools_1.createParams)({
                        plugin: command.plugin && command.plugin.name,
                        command: command.name,
                        array: array,
                        options: toolbox.parameters.options,
                        raw: rawCommand,
                        argv: process.argv,
                    });
                    // set a few properties
                    toolbox.plugin = command.plugin || this.defaultPlugin;
                    toolbox.command = command;
                    toolbox.pluginName = toolbox.plugin && toolbox.plugin.name;
                    toolbox.commandName = command.name;
                    // setup the config
                    toolbox.config = __assign({}, this.config);
                    if (toolbox.pluginName) {
                        toolbox.config[toolbox.pluginName] = __assign(__assign({}, toolbox.plugin.defaults), ((this.defaults && this.defaults[toolbox.pluginName]) || {}));
                    }
                    // expose cosmiconfig
                    toolbox.config.loadConfig = config_loader_1.loadConfig;
                    extensionSetupPromises = this.extensions.map(function (extension) {
                        var setupResult = extension.setup(toolbox);
                        return setupResult === undefined ? Promise.resolve(null) : Promise.resolve(setupResult);
                    });
                    return [4 /*yield*/, Promise.all(extensionSetupPromises)
                        // check for updates
                    ];
                case 1:
                    _c.sent();
                    if (!this.checkUpdate) return [3 /*break*/, 3];
                    return [4 /*yield*/, toolbox.meta.checkForUpdate()];
                case 2:
                    updateAvailable = _c.sent();
                    if (updateAvailable) {
                        console.log("Update available: ".concat(updateAvailable));
                    }
                    _c.label = 3;
                case 3:
                    if (!toolbox.command.run) return [3 /*break*/, 5];
                    // run the command
                    _b = toolbox;
                    return [4 /*yield*/, toolbox.command.run(toolbox)];
                case 4:
                    // run the command
                    _b.result = _c.sent();
                    _c.label = 5;
                case 5:
                    finalToolbox = toolbox;
                    return [2 /*return*/, finalToolbox];
            }
        });
    });
}
exports.run = run;
//# sourceMappingURL=run.js.map