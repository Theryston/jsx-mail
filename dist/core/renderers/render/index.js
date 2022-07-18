"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ReactRender_1 = require("./ReactRender");
class Render {
    constructor(inputPath) {
        this.inputPath = inputPath;
    }
    async run(templateName, variables) {
        const indexFilePath = path_1.default.join(this.inputPath, 'index.js');
        if (!fs_1.default.existsSync(indexFilePath)) {
            throw new Error('Index file not found');
        }
        const indexFile = await Promise.resolve().then(() => __importStar(require(indexFilePath)));
        const templateReactElement = indexFile[templateName];
        if (!templateReactElement) {
            throw new Error('Template not found: ' + templateName);
        }
        const reactRender = new ReactRender_1.ReactRender(templateReactElement, variables);
        const { htmlCode, styleTag } = await reactRender.run();
        return `<!DOCTYPE html><html><head><title>${templateName}</title>${styleTag}</head><body>${htmlCode}</body></html>`;
    }
}
exports.Render = Render;
