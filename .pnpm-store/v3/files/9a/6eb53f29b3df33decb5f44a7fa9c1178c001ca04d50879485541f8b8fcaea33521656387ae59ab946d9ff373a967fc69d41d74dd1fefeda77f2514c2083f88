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
exports.prompt = void 0;
function getEnquirer() {
    var Enquirer = require('enquirer');
    return new Enquirer();
}
/**
 * A yes/no question.
 *
 * @param message The message to display to the user.
 * @returns The true/false answer.
 */
var confirm = function (message, initial) { return __awaiter(void 0, void 0, void 0, function () {
    var yesno;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getEnquirer().prompt({
                    name: 'yesno',
                    type: 'confirm',
                    message: message,
                    initial: initial,
                })];
            case 1:
                yesno = (_a.sent()).yesno;
                return [2 /*return*/, yesno];
        }
    });
}); };
/**
 * We're replicating the interface of Enquirer in order to
 * "lazy load" the package only if and when we actually are asked for it.
 * This results in a significant speed increase.
 */
var prompt = {
    confirm: confirm,
    ask: function (questions) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (Array.isArray(questions)) {
                // Because Enquirer 2 breaks backwards compatility (and we don't want to)
                // we are translating the previous API to the current equivalent.
                questions = questions.map(function (q) {
                    // if q is a function, run it to get the actual question object
                    if (typeof q === 'function')
                        q = q();
                    if (q.type === 'rawlist' || q.type === 'list')
                        q.type = 'select';
                    if (q.type === 'expand')
                        q.type = 'autocomplete';
                    if (q.type === 'checkbox')
                        q.type = 'multiselect';
                    if (q.type === 'radio')
                        q.type = 'select';
                    if (q.type === 'question')
                        q.type = 'input';
                    return q;
                });
            }
            return [2 /*return*/, getEnquirer().prompt(questions)];
        });
    }); },
    separator: function () { return getEnquirer().separator(); },
};
exports.prompt = prompt;
//# sourceMappingURL=prompt-tools.js.map