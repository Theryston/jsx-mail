import { transformSync } from '@babel/core';
import path from 'path';

import {
  IFileContentTree,
  IJSXMailContentTree,
} from '../../../interfaces/IDirectory';

export class BuildFileJSXToJS {
  static async execute(
    fileContentTree: IFileContentTree,
  ): Promise<IJSXMailContentTree> {
    const jsxMailTree: IJSXMailContentTree = {
      folders: [],
      folderPath: fileContentTree.folderPath,
      files: [],
    };

    for (const file of fileContentTree.files) {
      const fileJSXMail = await this.compile(file.fileContent);
      const fileJSXWithImports = await this.compile_import(
        fileJSXMail,
        fileContentTree.folderPath,
      );
      jsxMailTree.files.push({
        filePath: file.filePath,
        fileJSXMail: fileJSXWithImports,
      });
    }

    for (const folder of fileContentTree.folders) {
      const folderJSXMail = await this.execute(folder);
      jsxMailTree.folders.push(folderJSXMail);
    }

    return jsxMailTree;
  }

  private static async compile(fileContent: string): Promise<string> {
    const fileContentBuilded = await transformSync(
      `/** @jsx render */\n${fileContent}`,
      {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: [
          '@babel/plugin-syntax-jsx',
          '@babel/plugin-transform-react-display-name',
          '@babel/plugin-transform-react-jsx',
          [
            'babel-plugin-styled-components',
            {
              fileName: false,
            },
          ],
        ],
      },
    );
    return fileContentBuilded.code;
  }

  private static async compile_import(
    fileContent: string,
    directoryPath: string,
  ): Promise<string> {
    const lines = fileContent.split('\n').map(line => line.trim());

    const linesWithAbsolutePathInRequires = lines.map(lineContent => {
      if (!lineContent.includes('require')) {
        return lineContent;
      }

      let requirePath = lineContent.substring(
        lineContent.indexOf('require') + 8,
        lineContent.length - 1,
      );

      requirePath = requirePath.replace(/['"]/, '');
      requirePath = requirePath.replace(
        requirePath.substring(requirePath.indexOf('"'), requirePath.length),
        '',
      );

      if (!requirePath.startsWith('/') && !requirePath.startsWith('.')) {
        return lineContent;
      }

      // if (requirePath.endsWith('.css')) {
      //   throw new Error('css file not supported');
      // }

      let requireVariableName = lineContent
        .substring(0, lineContent.indexOf('='))
        .split(' ')[1];

      requireVariableName = requireVariableName.trim();

      const absolutePath = path
        .normalize(path.resolve(directoryPath, ...requirePath.split('/')))
        .replace(/\\/g, '/');

      // return `//@JSXMAIL_IMPORT_${requireVariableName} = require('${absolutePath}');`;
      return `const ${requireVariableName} = require('${absolutePath}');`;
    });

    return linesWithAbsolutePathInRequires.join('\n');
  }
}
