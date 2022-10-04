"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModule = void 0;
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
// try loading this module
function loadModule(path) {
    if (string_tools_1.strings.isBlank(path)) {
        throw new Error('path is required');
    }
    if (filesystem_tools_1.filesystem.isNotFile(path)) {
        throw new Error("".concat(path, " is not a file"));
    }
    require.resolve(path);
    return require(path);
}
exports.loadModule = loadModule;
//# sourceMappingURL=module-loader.js.map