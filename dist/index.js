"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const cli_1 = require("./cli");
const core_1 = require("./core");
const getFileConfig_1 = require("./utils/getFileConfig");
exports.default = cli_1.cli;
async function render(templateName, variables) {
    const config = await (0, getFileConfig_1.getFileConfig)();
    const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);
    const core = new core_1.Core(mailPath, `${mailPath}/dist`);
    return await core.render(templateName, variables);
}
exports.render = render;
