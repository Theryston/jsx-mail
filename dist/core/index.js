"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const build_1 = require("./renderers/build");
const render_1 = require("./renderers/render");
class Core {
    constructor(inputPath, outputPath) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
    }
    async build() {
        const build = new build_1.Build(this.inputPath, this.outputPath);
        await build.run();
    }
    async render(templateName, variables) {
        const render = new render_1.Render(this.outputPath);
        const htmlCode = await render.run(templateName, variables);
        return htmlCode;
    }
}
exports.Core = Core;
