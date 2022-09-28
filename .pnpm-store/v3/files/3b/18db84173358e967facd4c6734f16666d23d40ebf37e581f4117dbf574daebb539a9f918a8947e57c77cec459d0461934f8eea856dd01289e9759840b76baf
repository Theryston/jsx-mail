"use strict";
/*
 * Copyright (c) 2015, Yahoo Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
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
var Handlebars = require("handlebars");
var fs = require("graceful-fs");
var path = require("path");
var util_1 = require("util");
var globSync = require("glob");
var glob = (0, util_1.promisify)(globSync);
var readFile = (0, util_1.promisify)(fs.readFile);
// -----------------------------------------------------------------------------
var defaultConfig = {
    handlebars: Handlebars,
    extname: ".handlebars",
    encoding: "utf8",
    layoutsDir: undefined,
    partialsDir: undefined,
    defaultLayout: "main",
    helpers: undefined,
    compilerOptions: undefined,
    runtimeOptions: undefined,
};
var ExpressHandlebars = /** @class */ (function () {
    function ExpressHandlebars(config) {
        if (config === void 0) { config = {}; }
        // Config properties with defaults.
        Object.assign(this, defaultConfig, config);
        // save given config to override other settings.
        this.config = config;
        // Express view engine integration point.
        this.engine = this.renderView.bind(this);
        // Normalize `extname`.
        if (this.extname.charAt(0) !== ".") {
            this.extname = "." + this.extname;
        }
        // Internal caches of compiled and precompiled templates.
        this.compiled = {};
        this.precompiled = {};
        // Private internal file system cache.
        this._fsCache = {};
    }
    ExpressHandlebars.prototype.getPartials = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var partialsDirs, dirs, partials, _i, dirs_1, dir, templates, namespace, rename, filePaths, getTemplateNameFn, _a, filePaths_1, filePath, partialName;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof this.partialsDir === "undefined") {
                            return [2 /*return*/, {}];
                        }
                        partialsDirs = Array.isArray(this.partialsDir) ? this.partialsDir : [this.partialsDir];
                        return [4 /*yield*/, Promise.all(partialsDirs.map(function (dir) { return __awaiter(_this, void 0, void 0, function () {
                                var dirPath, dirTemplates, dirNamespace, dirRename, templates, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            // Support `partialsDir` collection with object entries that contain a
                                            // templates promise and a namespace.
                                            if (typeof dir === "string") {
                                                dirPath = dir;
                                            }
                                            else if (typeof dir === "object") {
                                                dirTemplates = dir.templates;
                                                dirNamespace = dir.namespace;
                                                dirRename = dir.rename;
                                                dirPath = dir.dir;
                                            }
                                            // We must have some path to templates, or templates themselves.
                                            if (!dirPath && !dirTemplates) {
                                                throw new Error("A partials dir must be a string or config object");
                                            }
                                            _a = dirTemplates;
                                            if (_a) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.getTemplates(dirPath, options)];
                                        case 1:
                                            _a = (_b.sent());
                                            _b.label = 2;
                                        case 2:
                                            templates = _a;
                                            return [2 /*return*/, {
                                                    templates: templates,
                                                    namespace: dirNamespace,
                                                    rename: dirRename,
                                                }];
                                    }
                                });
                            }); }))];
                    case 1:
                        dirs = _b.sent();
                        partials = {};
                        for (_i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                            dir = dirs_1[_i];
                            templates = dir.templates, namespace = dir.namespace, rename = dir.rename;
                            filePaths = Object.keys(templates);
                            getTemplateNameFn = typeof rename === "function"
                                ? rename
                                : this._getTemplateName.bind(this);
                            for (_a = 0, filePaths_1 = filePaths; _a < filePaths_1.length; _a++) {
                                filePath = filePaths_1[_a];
                                partialName = getTemplateNameFn(filePath, namespace);
                                partials[partialName] = templates[filePath];
                            }
                        }
                        return [2 /*return*/, partials];
                }
            });
        });
    };
    ExpressHandlebars.prototype.getTemplate = function (filePath, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var encoding, cache, template, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path.resolve(filePath);
                        encoding = options.encoding || this.encoding;
                        cache = options.precompiled ? this.precompiled : this.compiled;
                        template = options.cache && cache[filePath];
                        if (template) {
                            return [2 /*return*/, template];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        cache[filePath] = this._getFile(filePath, { cache: options.cache, encoding: encoding })
                            .then(function (file) {
                            var compileTemplate = (options.precompiled ? _this._precompileTemplate : _this._compileTemplate).bind(_this);
                            return compileTemplate(file, _this.compilerOptions);
                        });
                        return [4 /*yield*/, cache[filePath]];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        delete cache[filePath];
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExpressHandlebars.prototype.getTemplates = function (dirPath, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cache, filePaths, templates, hash, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = options.cache;
                        return [4 /*yield*/, this._getDir(dirPath, { cache: cache })];
                    case 1:
                        filePaths = _a.sent();
                        return [4 /*yield*/, Promise.all(filePaths.map(function (filePath) {
                                return _this.getTemplate(path.join(dirPath, filePath), options);
                            }))];
                    case 2:
                        templates = _a.sent();
                        hash = {};
                        for (i = 0; i < filePaths.length; i++) {
                            hash[filePaths[i]] = templates[i];
                        }
                        return [2 /*return*/, hash];
                }
            });
        });
    };
    ExpressHandlebars.prototype.render = function (filePath, context, options) {
        if (context === void 0) { context = {}; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var encoding, _a, template, partials, helpers, runtimeOptions, data, html;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        encoding = options.encoding || this.encoding;
                        return [4 /*yield*/, Promise.all([
                                this.getTemplate(filePath, { cache: options.cache, encoding: encoding }),
                                (options.partials || this.getPartials({ cache: options.cache, encoding: encoding })),
                            ])];
                    case 1:
                        _a = _b.sent(), template = _a[0], partials = _a[1];
                        helpers = __assign(__assign({}, this.helpers), options.helpers);
                        runtimeOptions = __assign(__assign({}, this.runtimeOptions), options.runtimeOptions);
                        data = __assign(__assign({}, options.data), { exphbs: __assign(__assign({}, options), { filePath: filePath, helpers: helpers, partials: partials, runtimeOptions: runtimeOptions }) });
                        html = this._renderTemplate(template, context, __assign(__assign({}, runtimeOptions), { data: data, helpers: helpers, partials: partials }));
                        return [2 /*return*/, html];
                }
            });
        });
    };
    ExpressHandlebars.prototype.renderView = function (viewPath, options, callback) {
        if (options === void 0) { options = {}; }
        if (callback === void 0) { callback = null; }
        return __awaiter(this, void 0, void 0, function () {
            var context, promise, view, views, viewsPath, encoding, helpers, partials, _a, renderOptions, html, layoutPath, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof options === "function") {
                            callback = options;
                            options = {};
                        }
                        context = options;
                        promise = null;
                        if (!callback) {
                            promise = new Promise(function (resolve, reject) {
                                callback = function (err, value) { err !== null ? reject(err) : resolve(value); };
                            });
                        }
                        views = options.settings && options.settings.views;
                        viewsPath = this._resolveViewsPath(views, viewPath);
                        if (viewsPath) {
                            view = this._getTemplateName(path.relative(viewsPath, viewPath));
                            this.partialsDir = this.config.partialsDir || path.join(viewsPath, "partials/");
                            this.layoutsDir = this.config.layoutsDir || path.join(viewsPath, "layouts/");
                        }
                        encoding = options.encoding || this.encoding;
                        helpers = __assign(__assign({}, this.helpers), options.helpers);
                        _a = [{}];
                        return [4 /*yield*/, this.getPartials({ cache: options.cache, encoding: encoding })];
                    case 1:
                        partials = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([_b.sent()])), (options.partials || {})]);
                        renderOptions = {
                            cache: options.cache,
                            encoding: encoding,
                            view: view,
                            layout: "layout" in options ? options.layout : this.defaultLayout,
                            data: options.data,
                            helpers: helpers,
                            partials: partials,
                            runtimeOptions: options.runtimeOptions,
                        };
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.render(viewPath, context, renderOptions)];
                    case 3:
                        html = _b.sent();
                        layoutPath = this._resolveLayoutPath(renderOptions.layout);
                        if (!layoutPath) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.render(layoutPath, __assign(__assign({}, context), { body: html }), __assign(__assign({}, renderOptions), { layout: undefined }))];
                    case 4:
                        html = _b.sent();
                        _b.label = 5;
                    case 5:
                        callback(null, html);
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _b.sent();
                        callback(err_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, promise];
                }
            });
        });
    };
    // -- Protected Hooks ----------------------------------------------------------
    ExpressHandlebars.prototype._compileTemplate = function (template, options) {
        if (options === void 0) { options = {}; }
        return this.handlebars.compile(template.trim(), options);
    };
    ExpressHandlebars.prototype._precompileTemplate = function (template, options) {
        if (options === void 0) { options = {}; }
        return this.handlebars.precompile(template.trim(), options);
    };
    ExpressHandlebars.prototype._renderTemplate = function (template, context, options) {
        if (context === void 0) { context = {}; }
        if (options === void 0) { options = {}; }
        return template(context, options).trim();
    };
    // -- Private ------------------------------------------------------------------
    ExpressHandlebars.prototype._getDir = function (dirPath, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cache, dir, pattern, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dirPath = path.resolve(dirPath);
                        cache = this._fsCache;
                        dir = options.cache && cache[dirPath];
                        if (!dir) return [3 /*break*/, 2];
                        return [4 /*yield*/, dir];
                    case 1: return [2 /*return*/, (_a.sent()).concat()];
                    case 2:
                        pattern = "**/*" + this.extname;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        dir = cache[dirPath] = glob(pattern, {
                            cwd: dirPath,
                            follow: true,
                        });
                        // @ts-ignore FIXME: not sure how to throw error in glob for test coverage
                        if (options._throwTestError) {
                            throw new Error("test");
                        }
                        return [4 /*yield*/, dir];
                    case 4: return [2 /*return*/, (_a.sent()).concat()];
                    case 5:
                        err_3 = _a.sent();
                        delete cache[dirPath];
                        throw err_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ExpressHandlebars.prototype._getFile = function (filePath, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var cache, encoding, file, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path.resolve(filePath);
                        cache = this._fsCache;
                        encoding = options.encoding || this.encoding;
                        file = options.cache && cache[filePath];
                        if (file) {
                            return [2 /*return*/, file];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        cache[filePath] = readFile(filePath, { encoding: encoding || "utf8" });
                        return [4 /*yield*/, cache[filePath]];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_4 = _a.sent();
                        delete cache[filePath];
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ExpressHandlebars.prototype._getTemplateName = function (filePath, namespace) {
        if (namespace === void 0) { namespace = null; }
        var name = filePath;
        if (name.endsWith(this.extname)) {
            name = name.substring(0, name.length - this.extname.length);
        }
        if (namespace) {
            name = namespace + "/" + name;
        }
        return name;
    };
    ExpressHandlebars.prototype._resolveViewsPath = function (views, file) {
        if (!Array.isArray(views)) {
            return views;
        }
        var lastDir = path.resolve(file);
        var dir = path.dirname(lastDir);
        var absoluteViews = views.map(function (v) { return path.resolve(v); });
        // find the closest parent
        while (dir !== lastDir) {
            var index = absoluteViews.indexOf(dir);
            if (index >= 0) {
                return views[index];
            }
            lastDir = dir;
            dir = path.dirname(lastDir);
        }
        // cannot resolve view
        return null;
    };
    ExpressHandlebars.prototype._resolveLayoutPath = function (layoutPath) {
        if (!layoutPath) {
            return null;
        }
        if (!path.extname(layoutPath)) {
            layoutPath += this.extname;
        }
        return path.resolve(this.layoutsDir || "", layoutPath);
    };
    return ExpressHandlebars;
}());
exports.default = ExpressHandlebars;
//# sourceMappingURL=express-handlebars.js.map