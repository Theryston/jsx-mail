"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageManager = exports.prompt = exports.patching = exports.http = exports.semver = exports.system = exports.print = exports.strings = exports.filesystem = exports.build = void 0;
var path = require("path");
// first, do a sniff test to ensure our dependencies are met
var sniff = require('../sniff');
// check the node version
if (!sniff.isNewEnough) {
    console.log('Node.js 7.6+ is required to run. You have ' + sniff.nodeVersion + '. Womp, womp.');
    process.exit(1);
}
// we want to see real exceptions with backtraces and stuff
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', function (up) {
    throw up;
});
// export the `build` command
var builder_1 = require("./domain/builder");
Object.defineProperty(exports, "build", { enumerable: true, get: function () { return builder_1.build; } });
// export the toolbox
var filesystem_tools_1 = require("./toolbox/filesystem-tools");
Object.defineProperty(exports, "filesystem", { enumerable: true, get: function () { return filesystem_tools_1.filesystem; } });
var string_tools_1 = require("./toolbox/string-tools");
Object.defineProperty(exports, "strings", { enumerable: true, get: function () { return string_tools_1.strings; } });
var print_tools_1 = require("./toolbox/print-tools");
Object.defineProperty(exports, "print", { enumerable: true, get: function () { return print_tools_1.print; } });
var system_tools_1 = require("./toolbox/system-tools");
Object.defineProperty(exports, "system", { enumerable: true, get: function () { return system_tools_1.system; } });
var semver_tools_1 = require("./toolbox/semver-tools");
Object.defineProperty(exports, "semver", { enumerable: true, get: function () { return semver_tools_1.semver; } });
var http_tools_1 = require("./toolbox/http-tools");
Object.defineProperty(exports, "http", { enumerable: true, get: function () { return http_tools_1.http; } });
var patching_tools_1 = require("./toolbox/patching-tools");
Object.defineProperty(exports, "patching", { enumerable: true, get: function () { return patching_tools_1.patching; } });
var prompt_tools_1 = require("./toolbox/prompt-tools");
Object.defineProperty(exports, "prompt", { enumerable: true, get: function () { return prompt_tools_1.prompt; } });
var package_manager_tools_1 = require("./toolbox/package-manager-tools");
Object.defineProperty(exports, "packageManager", { enumerable: true, get: function () { return package_manager_tools_1.packageManager; } });
// this adds the node_modules path to the "search path"
// it's hacky, but it works well!
require('app-module-path').addPath(path.join(__dirname, '..', 'node_modules'));
require('app-module-path').addPath(process.cwd());
//# sourceMappingURL=index.js.map