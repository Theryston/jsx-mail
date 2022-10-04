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
exports.buildGenerate = void 0;
var utils_1 = require("./utils");
var filesystem_tools_1 = require("../toolbox/filesystem-tools");
var string_tools_1 = require("../toolbox/string-tools");
function buildGenerate(toolbox) {
    var plugin = toolbox.plugin;
    /**
     * Generates a file from a template.
     *
     * @param opts Generation options.
     * @return The generated string.
     */
    function generate(opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var ejs, template, target, props, data, baseDirectory, templateDirectory, pathToTemplate, templateContent, content, dir, dest;
            return __generator(this, function (_a) {
                ejs = require('ejs');
                template = opts.template;
                target = opts.target;
                props = opts.props || {};
                data = __assign({ config: toolbox && toolbox.config, parameters: toolbox && toolbox.parameters, props: props, filename: '' }, string_tools_1.strings);
                baseDirectory = plugin && plugin.directory;
                templateDirectory = opts.directory || "".concat(baseDirectory, "/templates");
                pathToTemplate = "".concat(templateDirectory, "/").concat(template);
                // check ./build/templates too, if that doesn't exist
                if (!filesystem_tools_1.filesystem.isFile(pathToTemplate)) {
                    templateDirectory = opts.directory || "".concat(baseDirectory, "/build/templates");
                    pathToTemplate = "".concat(templateDirectory, "/").concat(template);
                }
                // bomb if the template doesn't exist
                if (!filesystem_tools_1.filesystem.isFile(pathToTemplate)) {
                    throw new Error("template not found ".concat(pathToTemplate));
                }
                // add template path to support includes
                data.filename = pathToTemplate;
                templateContent = filesystem_tools_1.filesystem.read(pathToTemplate);
                content = ejs.render(templateContent, data);
                // save it to the file system
                if (!string_tools_1.strings.isBlank(target)) {
                    dir = (0, utils_1.replace)(/$(\/)*/g, '', target);
                    dest = filesystem_tools_1.filesystem.path(dir);
                    filesystem_tools_1.filesystem.write(dest, content);
                }
                // send back the rendered string
                return [2 /*return*/, content];
            });
        });
    }
    return generate;
}
exports.buildGenerate = buildGenerate;
//# sourceMappingURL=template-tools.js.map