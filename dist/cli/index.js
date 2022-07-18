"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const parseArgumentsIntoOptions_1 = require("./parseArgumentsIntoOptions");
const server_1 = require("../server");
const getFileConfig_1 = require("../utils/getFileConfig");
const core_1 = require("../core");
function cli(args) {
    let options = (0, parseArgumentsIntoOptions_1.parseArgumentsIntoOptions)(args);
    const command = options.command;
    const cli = {
        server: async (options) => {
            const port = options['--port'];
            if (!port) {
                throw new Error('Missing port');
            }
            const config = await (0, getFileConfig_1.getFileConfig)();
            const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);
            await (0, server_1.server)(mailPath, port);
        },
        build: async () => {
            const config = await (0, getFileConfig_1.getFileConfig)();
            const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);
            const core = new core_1.Core(mailPath, `${mailPath}/dist`);
            await core.build();
        },
    };
    return cli[command](options);
}
exports.cli = cli;
