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
var prompt_tools_1 = require("../../toolbox/prompt-tools");
module.exports = {
    name: 'kitchen',
    description: 'Runs through a kitchen sink of Gluegun tools',
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var print, update, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    print = toolbox.print;
                    return [4 /*yield*/, toolbox.meta.checkForUpdate()];
                case 1:
                    update = _a.sent();
                    print.info("Checking for update: ".concat(update));
                    return [4 /*yield*/, prompt_tools_1.prompt.ask([
                            {
                                type: 'list',
                                name: 'exlist',
                                message: 'What shoes are you wearing?',
                                choices: ['Clown', 'Other'],
                            },
                            {
                                type: 'confirm',
                                name: 'exconfirm',
                                message: 'Are you sure?',
                            },
                            {
                                type: 'select',
                                name: 'exselect',
                                message: 'What is your favorite team?',
                                choices: ['Jazz', 'Trail Blazers', 'Lakers', 'Warriors'],
                            },
                            {
                                type: 'multiselect',
                                name: 'exmultiselect',
                                message: 'What are your favorite months?',
                                choices: ['January', 'July', 'September', 'November'],
                            },
                            {
                                type: 'password',
                                name: 'expassword',
                                message: 'Enter a fake password',
                            },
                            {
                                type: 'input',
                                name: 'exinput',
                                message: 'What is your middle name?',
                            },
                            {
                                type: 'autocomplete',
                                name: 'exautocomplete',
                                message: 'State?',
                                choices: ['Oregon', 'Washington', 'California'],
                                // You can leave this off unless you want to customize behavior
                                suggest: function (s, choices) {
                                    return choices.filter(function (choice) {
                                        return choice.message.toLowerCase().startsWith(s.toLowerCase());
                                    });
                                },
                            },
                        ])];
                case 2:
                    result = _a.sent();
                    print.debug(result);
                    return [2 /*return*/];
            }
        });
    }); },
};
//# sourceMappingURL=kitchen.js.map