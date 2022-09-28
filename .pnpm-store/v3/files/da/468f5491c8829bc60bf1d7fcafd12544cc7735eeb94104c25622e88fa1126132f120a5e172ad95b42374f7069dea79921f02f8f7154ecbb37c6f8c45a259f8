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
exports.onAbort = exports.checkForUpdate = exports.commandInfo = exports.getVersion = exports.getPackageJSON = void 0;
var utils_1 = require("./utils");
/**
 * Finds the currently running CLI package.json
 *
 * @param toolbox
 * @returns Package.json contents as an object.
 */
function getPackageJSON(toolbox) {
    var directory = toolbox.meta.src;
    var filesystem = toolbox.filesystem;
    if (!directory)
        throw new Error('getVersion: Unknown CLI version (no src folder found)');
    // go at most 5 directories up to find the package.json
    for (var i = 0; i < 5; i += 1) {
        var pkg = filesystem.path(directory, 'package.json');
        // if we find a package.json, we're done -- read the version and return it
        if (filesystem.exists(pkg) === 'file')
            return filesystem.read(pkg, 'json');
        // if we reach the git repo or root, we can't determine the version -- this is where we bail
        var git = filesystem.path(directory, '.git');
        var root = filesystem.path('/');
        if (directory === root || filesystem.exists(git) === 'dir')
            break;
        // go up another directory
        directory = filesystem.path(directory, '..');
    }
    throw new Error("getPackageJSON: No package.json found in ".concat(directory));
}
exports.getPackageJSON = getPackageJSON;
/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
function getVersion(toolbox) {
    return getPackageJSON(toolbox).version;
}
exports.getVersion = getVersion;
/**
 * Gets the list of plugins.
 *
 * @param toolbox The toolbox
 * @param plugins The plugins holding the commands
 * @param commandRoot Optional, only show commands with this root
 * @return List of plugins.
 */
function commandInfo(toolbox, commandRoot) {
    return toolbox.runtime.commands.reduce(function (commands, command) {
        if (!command.hidden && (!commandRoot || (0, utils_1.equals)(command.commandPath.slice(0, commandRoot.length), commandRoot))) {
            var alias = command.hasAlias() ? "(".concat(command.aliases.join(', '), ")") : '';
            var commandPath = command.name ? command.commandPath.slice(0, -1).concat(command.name) : command.commandPath;
            commands.push([
                "".concat(commandPath.join(' '), " ").concat(alias),
                (0, utils_1.replace)('$BRAND', toolbox.runtime.brand, command.description || '-'),
            ]);
        }
        return commands;
    }, []);
}
exports.commandInfo = commandInfo;
function checkForUpdate(toolbox) {
    return __awaiter(this, void 0, void 0, function () {
        var system, semver, packageJSON, myVersion, packageName, latestVersion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    system = toolbox.system, semver = toolbox.semver;
                    packageJSON = getPackageJSON(toolbox);
                    myVersion = packageJSON.version;
                    packageName = packageJSON.name;
                    return [4 /*yield*/, system.run("npm info ".concat(packageName, " dist-tags.latest"))];
                case 1:
                    latestVersion = _a.sent();
                    if (semver.gt(latestVersion, myVersion))
                        return [2 /*return*/, latestVersion];
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.checkForUpdate = checkForUpdate;
/**
 * Executes the given callback when a termination signal is received.
 * If callback returns a promise, it will wait for promise to resolve before aborting.
 *
 * @param callback Callback function for handling process termination
 */
function onAbort(callback) {
    var _this = this;
    var signals = ['SIGINT', 'SIGQUIT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'];
    signals.forEach(function (signal) {
        process.on(signal, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve()];
                    case 1:
                        _a.sent();
                        signals.forEach(function (removeSignal) {
                            // Remove listeners to prevent calling it multiple times
                            process.removeAllListeners(removeSignal);
                            // Add empty listeners to prevent terminating while onAbort callback is running
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            process.on(removeSignal, function () { });
                        });
                        return [4 /*yield*/, callback(signal)];
                    case 2:
                        _a.sent();
                        process.exit();
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
exports.onAbort = onAbort;
//# sourceMappingURL=meta-tools.js.map