"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
var cosmiconfig_1 = require("cosmiconfig");
/**
 * Loads the config for the app via CosmicConfig by searching in a few places.
 *
 * @param name The base name of the config to load.
 * @param src The directory to look in.
 */
function loadConfig(name, src) {
    // attempt to load
    var cosmic = (0, cosmiconfig_1.cosmiconfigSync)(name || '').search(src || '');
    // use what we found or fallback to an empty object
    var config = (cosmic && cosmic.config) || {};
    return config;
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=config-loader.js.map