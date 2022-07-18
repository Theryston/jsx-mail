"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
const dir_1 = __importDefault(require("@babel/cli/lib/babel/dir"));
class Transform {
    async run(sourcePath, outputDir) {
        await (0, dir_1.default)({
            babelOptions: {
                presets: [
                    '@babel/preset-typescript',
                    [
                        '@babel/preset-react',
                        {
                            runtime: 'classic',
                        },
                    ],
                ],
                plugins: [
                    '@babel/plugin-transform-modules-commonjs',
                    [
                        'babel-plugin-styled-components',
                        {
                            ssr: false,
                        },
                    ],
                ],
            },
            cliOptions: {
                filenames: [sourcePath],
                extensions: ['.ts', '.js', '.tsx', '.jsx'],
                outDir: outputDir,
                copyFiles: true,
                copyIgnored: true,
            },
        });
    }
}
exports.Transform = Transform;
