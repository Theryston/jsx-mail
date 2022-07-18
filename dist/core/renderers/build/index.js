"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = void 0;
const Transform_1 = require("./Transform");
class Build {
    constructor(inputPath, outputPath) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.transform = new Transform_1.Transform();
    }
    async run() {
        await this.transform.run(this.inputPath, this.outputPath);
    }
}
exports.Build = Build;
