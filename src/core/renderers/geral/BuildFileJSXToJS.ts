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
      const fileJSXMail = await this.build(
        file.fileContent,
        fileContentTree.folderPath,
      );
      jsxMailTree.files.push({
        filePath: file.filePath,
        fileJSXMail,
      });
    }

    for (const folder of fileContentTree.folders) {
      const folderJSXMail = await this.execute(folder);
      jsxMailTree.folders.push(folderJSXMail);
    }

    return jsxMailTree;
  }

  private static async build(
    fileContent: string,
    folderPath: string,
  ): Promise<string> {
    const fileContentBuilded = await transformSync(
      `/** @jsx this.render */\n${fileContent}`,
      {
        presets: ['@babel/preset-react', '@babel/preset-env'],
        plugins: [
          '@babel/plugin-syntax-jsx',
          '@babel/plugin-transform-react-display-name',
          '@babel/plugin-transform-react-jsx',
        ],
      },
    );
    return fileContentBuilded.code;
  }
}
