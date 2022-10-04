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
var NewCommand = {
    name: 'new',
    alias: ['n', 'create'],
    description: 'Creates a new gluegun cli',
    hidden: false,
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var parameters, generate, filesystem, _a, error, info, colors, kebabCase, system, meta, prompt, o, ts, js, props, validName, answer, answer, lang, active, files, ext, yarnOrNpm;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parameters = toolbox.parameters, generate = toolbox.template.generate, filesystem = toolbox.filesystem, _a = toolbox.print, error = _a.error, info = _a.info, colors = _a.colors, kebabCase = toolbox.strings.kebabCase, system = toolbox.system, meta = toolbox.meta, prompt = toolbox.prompt;
                    o = parameters.options;
                    ts = Boolean(o.typescript || o.ts || o.t);
                    js = Boolean(o.javascript || o.js || o.j);
                    props = {
                        name: parameters.first,
                        language: ts ? 'typescript' : js ? 'javascript' : 'ask',
                        extension: undefined,
                    };
                    // sanity checks
                    if (!props.name || props.name.length === 0) {
                        error('You must provide a valid CLI name.');
                        error('Example: gluegun new movies');
                        return [2 /*return*/, undefined];
                    }
                    else if (!/^[a-z0-9-]+$/.test(props.name)) {
                        validName = kebabCase(props.name);
                        error("".concat(props.name, " is not a valid name. Use lower-case and dashes only."));
                        error("Suggested: gluegun new ".concat(validName));
                        return [2 /*return*/, undefined];
                    }
                    if (!filesystem.exists(props.name)) return [3 /*break*/, 2];
                    info("");
                    error("There's already a folder named ".concat(props.name, " here."));
                    return [4 /*yield*/, prompt.confirm("Do you want to overwrite it?")];
                case 1:
                    answer = _b.sent();
                    if (answer) {
                        filesystem.remove(props.name);
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                    _b.label = 2;
                case 2:
                    if (!(props.language === 'ask')) return [3 /*break*/, 4];
                    info("");
                    return [4 /*yield*/, prompt.ask({
                            type: 'select',
                            name: 'answer',
                            message: 'Which language would you like to use?',
                            choices: [
                                'TypeScript - Gives you a build pipeline out of the box (default)',
                                'Modern JavaScript - Node 8.2+ and ES2016+ (https://node.green/)',
                            ],
                        })
                        // we default to TypeScript if they just press "enter"
                    ];
                case 3:
                    answer = (_b.sent()).answer;
                    lang = (answer && answer.toLowerCase()) || 'typescript';
                    props.language = lang.includes('typescript') ? 'typescript' : 'javascript';
                    info("Language used: ".concat(props.language === 'typescript' ? 'TypeScript' : 'Modern JavaScript'));
                    _b.label = 4;
                case 4:
                    props.extension = props.language === 'typescript' ? 'ts' : 'js';
                    // create the directory
                    filesystem.dir(props.name);
                    active = [];
                    // executable is treated specially
                    active.push(generate({
                        template: "cli/bin/cli-executable.ejs",
                        target: "./".concat(props.name, "/bin/").concat(props.name),
                        props: props,
                    }));
                    files = [
                        '__tests__/cli-integration.test.js.ejs',
                        'docs/commands.md.ejs',
                        'docs/plugins.md.ejs',
                        'src/commands/generate.js.ejs',
                        'src/commands/default.js.ejs',
                        'src/extensions/cli-extension.js.ejs',
                        'src/templates/model.js.ejs.ejs',
                        'src/cli.js.ejs',
                        'LICENSE.ejs',
                        'package.json.ejs',
                        'readme.md.ejs',
                        '.gitignore.ejs',
                        '.eslintrc.js.ejs',
                    ];
                    if (props.language === 'typescript') {
                        files.push('src/types.js.ejs');
                        files.push('tsconfig.json.ejs');
                    }
                    // rename js files to ts
                    active = files.reduce(function (prev, file) {
                        var template = "cli/".concat(file);
                        var target = "".concat(props.name, "/") +
                            (props.language === 'typescript' && file.includes('.js.ejs') && !file.startsWith('.')
                                ? file.replace('.js.ejs', '.ts')
                                : file.replace('.ejs', ''));
                        var gen = generate({ template: template, target: target, props: props });
                        return prev.concat([gen]);
                    }, active);
                    // let all generator calls run in parallel
                    return [4 /*yield*/, Promise.all(active)
                        // make bin executable
                    ];
                case 5:
                    // let all generator calls run in parallel
                    _b.sent();
                    // make bin executable
                    filesystem.chmodSync("".concat(props.name, "/bin/").concat(props.name), '755');
                    ext = props.language === 'typescript' ? 'ts' : 'js';
                    filesystem.rename("".concat(props.name, "/src/commands/default.").concat(ext), "".concat(props.name, ".").concat(ext));
                    yarnOrNpm = system.which('yarn') ? 'yarn' : 'npm';
                    return [4 /*yield*/, system.spawn("cd ".concat(props.name, " && ").concat(yarnOrNpm, " install --silent && ").concat(yarnOrNpm, " run --quiet format"), {
                            shell: true,
                            stdio: 'inherit',
                        })
                        // we're done, so show what to do next
                    ];
                case 6:
                    _b.sent();
                    // we're done, so show what to do next
                    info("");
                    info(colors.green("Generated ".concat(props.name, " CLI with Gluegun ").concat(meta.version(), ".")));
                    if (props.language === 'typescript')
                        info(colors.gray("Using TypeScript"));
                    info("");
                    info("Next:");
                    info("  $ cd ".concat(props.name));
                    info("  $ ".concat(yarnOrNpm, " test"));
                    info("  $ ".concat(yarnOrNpm, " link"));
                    info("  $ ".concat(props.name));
                    info("");
                    if (props.language === 'typescript') {
                        info(colors.gray("Since you generated a TypeScript project, we've included a build script."));
                        info(colors.gray("When you link and run the project, it will use ts-node locally to test."));
                        info(colors.gray("However, you can test the generated JavaScript locally like this:"));
                        info("");
                        info("  $ ".concat(yarnOrNpm, " build"));
                        info("  $ ".concat(props.name, " --compiled-build"));
                        info("");
                    }
                    // for tests
                    return [2 /*return*/, "new ".concat(toolbox.parameters.first)];
            }
        });
    }); },
};
exports.default = NewCommand;
//# sourceMappingURL=new.js.map