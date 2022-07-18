"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgumentsIntoOptions = void 0;
const arg_1 = __importDefault(require("arg"));
function parseArgumentsIntoOptions(rawArgs) {
    const command = rawArgs.slice(2)[0];
    const argv = rawArgs.slice(3);
    const argCommand = {
        server: (params) => (0, arg_1.default)({
            '--port': Number,
        }, Object.assign({}, params)),
        build: (params) => (0, arg_1.default)({}, Object.assign({}, params)),
    };
    if (!argCommand[command]) {
        throw new Error(`Unknown command ${command}`);
    }
    return Object.assign({ command }, argCommand[command](argv));
}
exports.parseArgumentsIntoOptions = parseArgumentsIntoOptions;
