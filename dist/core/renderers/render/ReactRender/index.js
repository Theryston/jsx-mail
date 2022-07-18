"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactRender = void 0;
const styled_components_1 = require("styled-components");
const server_1 = require("react-dom/server");
class ReactRender {
    constructor(inicialCode, variables) {
        this.inicialCode = inicialCode;
        this.variables = variables;
        this.sheet = new styled_components_1.ServerStyleSheet();
    }
    async run() {
        const code = this.sheet.collectStyles(this.inicialCode(this.variables));
        const htmlCode = (0, server_1.renderToString)(code);
        const styleTag = this.sheet.getStyleTags();
        return {
            htmlCode,
            styleTag,
        };
    }
}
exports.ReactRender = ReactRender;
