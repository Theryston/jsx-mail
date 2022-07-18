"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("../core");
const app = (0, express_1.default)();
async function server(path, port) {
    const core = new core_1.Core(path, `${path}/dist`);
    await core.build();
    app.get('/:templateName', async (req, res) => {
        const templateName = req.params.templateName;
        if (templateName.indexOf('.') !== -1) {
            console.log(`Ignoring template name ${templateName}`);
            return res.status(400).send('Missing extension');
        }
        const variables = req.query;
        const htmlCode = await core.render(templateName, variables);
        res.send(htmlCode);
    });
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
exports.server = server;
