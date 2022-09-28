"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    run: function (_a) {
        var parameters = _a.parameters, runtime = _a.runtime, print = _a.print, strings = _a.strings, meta = _a.meta;
        var infoMessage = strings.isBlank(parameters.first)
            ? "Welcome to ".concat(print.colors.cyan(runtime.brand), " CLI version ").concat(meta.version(), "!")
            : "Sorry, didn't recognize that command!";
        print.info("\n  ".concat(infoMessage, "\n  Type ").concat(print.colors.magenta("".concat(runtime.brand, " --help")), " to view common commands."));
    },
};
//# sourceMappingURL=default.js.map