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
var expect = require("expect");
var sinon = require("sinon");
var uniqueTempDir = require("unique-temp-dir");
var path = require("path");
var cli_1 = require("./cli");
var stripANSI = require('strip-ansi');
sinon.stub(console, 'log');
var pwd = process.cwd();
jest.setTimeout(5 * 60 * 1000);
test('can start the cli', function () { return __awaiter(void 0, void 0, void 0, function () {
    var c;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, cli_1.run)()];
            case 1:
                c = _a.sent();
                expect(c).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
test('can create a new boilerplate JavaScript cli', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tmp, toolbox, gluegunPath, gluegunAddCommand, pkg, testResults, runCommand, cleanCmd, genCommand, genFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tmp = uniqueTempDir({ create: true });
                process.chdir(tmp);
                return [4 /*yield*/, (0, cli_1.run)('new foo --javascript')];
            case 1:
                toolbox = _a.sent();
                expect(toolbox.command.name).toBe('new');
                gluegunPath = path.join(__dirname, '..', '..');
                gluegunAddCommand = require('which').sync('yarn', { nothrow: true })
                    ? "yarn add ".concat(gluegunPath, " --silent")
                    : "npm install ".concat(gluegunPath, " --silent");
                return [4 /*yield*/, toolbox.system.spawn("".concat(gluegunAddCommand))];
            case 2:
                _a.sent();
                pkg = toolbox.filesystem.read(path.join(tmp, 'foo', 'package.json'), 'json');
                expect(typeof pkg).toBe('object');
                expect(pkg.name).toBe('foo');
                expect(pkg.private).toBeTruthy();
                expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy();
                // Install local version of gluegun to test
                return [4 /*yield*/, toolbox.system.run("cd ".concat(path.join(tmp, 'foo'), " && yarn add ").concat(pwd, " && yarn link"))
                    // Run the tests
                ];
            case 3:
                // Install local version of gluegun to test
                _a.sent();
                return [4 /*yield*/, toolbox.system.run("cd ".concat(tmp, "/foo && yarn test"))];
            case 4:
                testResults = _a.sent();
                expect(testResults).toContain('jest');
                return [4 /*yield*/, toolbox.system.exec("node ".concat(tmp, "/foo/bin/foo --help"))];
            case 5:
                runCommand = _a.sent();
                cleanCmd = stripANSI(runCommand);
                expect(cleanCmd).toMatch(/version \(v\)/);
                expect(cleanCmd).toMatch(/Output the version number/);
                expect(cleanCmd).toMatch(/generate \(g\)/);
                expect(cleanCmd).toMatch(/help \(h\)/);
                return [4 /*yield*/, toolbox.system.exec("node ".concat(tmp, "/foo/bin/foo g flub"))];
            case 6:
                genCommand = _a.sent();
                console.log(genCommand);
                genFile = toolbox.filesystem.read("".concat(tmp, "/models/flub-model.js"));
                expect(genFile).toMatch(/name: 'flub'/);
                // clean up
                process.chdir(pwd);
                toolbox.filesystem.remove(path.join(tmp, 'foo'));
                return [2 /*return*/];
        }
    });
}); });
test('can create a new boilerplate TypeScript cli', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tmp, toolbox, gluegunPath, gluegunAddCommand, pkg, testResults, runCommand, cleanCmd, genCommand, genFile, generateResult, kitchenCommand;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tmp = uniqueTempDir({ create: true });
                console.log(tmp);
                process.chdir(tmp);
                return [4 /*yield*/, (0, cli_1.run)('new foo-ts --typescript')];
            case 1:
                toolbox = _a.sent();
                expect(toolbox.command.name).toBe('new');
                gluegunPath = path.join(__dirname, '..', '..');
                gluegunAddCommand = require('which').sync('yarn', { nothrow: true })
                    ? "yarn add ".concat(gluegunPath, " --silent")
                    : "npm install ".concat(gluegunPath, " --silent");
                return [4 /*yield*/, toolbox.system.spawn("".concat(gluegunAddCommand))];
            case 2:
                _a.sent();
                pkg = toolbox.filesystem.read(path.join(tmp, 'foo-ts', 'package.json'), 'json');
                expect(typeof pkg).toBe('object');
                expect(pkg.name).toBe('foo-ts');
                expect(pkg.private).toBeTruthy();
                expect(Object.keys(pkg.dependencies).includes('gluegun')).toBeTruthy();
                // Install local version of gluegun to test
                return [4 /*yield*/, toolbox.system.run("cd ".concat(path.join(tmp, 'foo-ts'), " && yarn add ").concat(pwd, " && yarn link"))
                    // Run the tests
                ];
            case 3:
                // Install local version of gluegun to test
                _a.sent();
                return [4 /*yield*/, toolbox.system.run("cd ".concat(tmp, "/foo-ts && yarn test"))];
            case 4:
                testResults = _a.sent();
                expect(testResults).toContain('jest');
                return [4 /*yield*/, toolbox.system.exec("node ".concat(tmp, "/foo-ts/bin/foo-ts --help"))];
            case 5:
                runCommand = _a.sent();
                cleanCmd = stripANSI(runCommand);
                expect(cleanCmd).toMatch(/version \(v\)/);
                expect(cleanCmd).toMatch(/Output the version number/);
                expect(cleanCmd).toMatch(/generate \(g\)/);
                expect(cleanCmd).toMatch(/help \(h\)/);
                return [4 /*yield*/, toolbox.system.exec("node ".concat(tmp, "/foo-ts/bin/foo-ts g flub"))];
            case 6:
                genCommand = _a.sent();
                console.log(genCommand);
                genFile = toolbox.filesystem.read("".concat(tmp, "/models/flub-model.ts"));
                expect(genFile).toMatch(/name: 'flub'/);
                return [4 /*yield*/, toolbox.template.generate({
                        template: "test/kitchen-sink-command.js.ejs",
                        target: "".concat(tmp, "/foo-ts/src/commands/kitchen.js"),
                    })
                    // Verify the result of the generated command
                ];
            case 7:
                generateResult = _a.sent();
                // Verify the result of the generated command
                expect(generateResult).toMatch(/module\.exports = \{/);
                return [4 /*yield*/, toolbox.system.exec("node ".concat(tmp, "/foo-ts/bin/foo-ts kitchen"))];
            case 8:
                kitchenCommand = _a.sent();
                expect(kitchenCommand).toMatch(/Hello. I am a chatty plugin./);
                expect(kitchenCommand).toMatch(/Busey/);
                // clean up
                process.chdir(pwd);
                toolbox.filesystem.remove(path.join(tmp, 'foo-ts'));
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=cli.integration.js.map