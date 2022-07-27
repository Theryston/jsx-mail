import * as babel from '@babel/core';
import { IFileSystem } from '../FileSystem/IFileSystem';
import { IJsxTransform, IJsxTransformOptions } from './IJsxTransform';
import path from 'path';

export class JsxTransform implements IJsxTransform {
  private firstAbsoluteSourcePath: string;

  constructor(private readonly fileSystem: IFileSystem) {}

  async directory(sourcePath: string, outputDir: string): Promise<void> {
    if (!this.firstAbsoluteSourcePath) {
      this.firstAbsoluteSourcePath = path.resolve(sourcePath);
    }

    if (await this.fileSystem.exists(path.join(sourcePath, outputDir))) {
      await this.fileSystem.rm(path.join(sourcePath, outputDir));
    }

    const entities = await this.fileSystem.getAllDirectoryTree(sourcePath, {
      justFilenameInFilePath: true,
    });
    for (const entity of entities) {
      if (entity.type === 'directory') {
        for (const child of entity.children) {
          await this.directory(child.path, outputDir);
        }
      } else {
        await this.file(
          path.join(sourcePath, entity.path),
          path.join(this.firstAbsoluteSourcePath, outputDir),
        );
      }
    }
  }

  async file(inputPath: string, outputDir: string): Promise<void> {
    const code = await this.fileSystem.readUtf8File(inputPath);
    const transformedCode = await this.code(code);
    const pathFromFirstPath = inputPath.replace(
      this.firstAbsoluteSourcePath,
      '',
    );
    const outputPath = path.join(
      outputDir,
      `${pathFromFirstPath.substr(0, pathFromFirstPath.lastIndexOf('.'))}.js`,
    );
    await this.fileSystem.writeFile(outputPath, transformedCode);
  }

  async code(code: string, options?: IJsxTransformOptions): Promise<string> {
    const { customRuntime } = options || {};

    if (customRuntime) {
      code = `/** @jsx ${customRuntime} */\n${code}`;
    }

    try {
      const result = babel.transform(code, {
        filename: 'file.tsx',
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
      });

      if (!result) {
        throw new Error(
          'for some reason the result that babel returned was undefined',
        );
      }

      if (!result.code) {
        throw new Error(
          'for some reason babel did not return any code when compiling',
        );
      }
      return result.code;
    } catch (error) {
      throw new Error(
        `[JsxTransform] transform code failed with message: ${error.message}`,
      );
    }
  }
}
