"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExtensionFromFile = void 0;
var extension_1 = require("../domain/extension");
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
var module_loader_1 = require("./module-loader");
/**
 * Loads the extension from a file.
 *
 * @param file The full path to the file to load.
 * @param options Options, such as
 */
function loadExtensionFromFile(file, _options) {
    if (_options === void 0) { _options = {}; }
    var extension = new extension_1.Extension();
    // sanity check the input
    if (string_tools_1.strings.isBlank(file)) {
        throw new Error("Error: couldn't load extension (file is blank): ".concat(file));
    }
    extension.file = file;
    // not a file?
    if (filesystem_tools_1.filesystem.isNotFile(file)) {
        throw new Error("Error: couldn't load command (not a file): ".concat(file));
    }
    // default is the name of the file without the extension
    extension.name = filesystem_tools_1.filesystem.inspect(file).name.split('.')[0];
    // require in the module -- best chance to bomb is here
    var extensionModule = (0, module_loader_1.loadModule)(file);
    // if they use `export default` rather than `module.exports =`, we extract that
    extensionModule = extensionModule.default || extensionModule;
    // should we try the default export?
    var valid = extensionModule && typeof extensionModule === 'function';
    if (valid) {
        extension.setup = function (toolbox) { return extensionModule(toolbox); };
    }
    else {
        throw new Error("Error: couldn't load ".concat(extension.name, ". Expected a function, got ").concat(extensionModule, "."));
    }
    return extension;
}
exports.loadExtensionFromFile = loadExtensionFromFile;
//# sourceMappingURL=extension-loader.js.map