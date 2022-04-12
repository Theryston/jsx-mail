import { transformFileSync } from '@babel/core';
import path from 'path';

const keys = ['import'];
const libs = ['styled-components'];

interface IProcessResult {
  result: string;
  libsFound: string[];
}

export class ReadAllFiles {
  basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async babel(pathFile: string): Promise<IProcessResult> {
    const fileId = Date.now();
    const libsFound: string[] = [];
    const { code: codeFromBabel } = transformFileSync(`${pathFile}`, {
      presets: ['@babel/preset-react'],
      plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-transform-react-display-name',
        '@babel/plugin-transform-react-jsx',
      ],
      auxiliaryCommentAfter: `@JSXMailFileId ${fileId}`,
    });

    const codeWithProcessedLines = await this.processLine(
      codeFromBabel,
      pathFile,
    );

    for (const lib of codeWithProcessedLines.libsFound) {
      if (lib) {
        const libInLibsFound = libsFound.find(
          libByAll => lib.indexOf(libByAll) !== -1,
        );
        if (!libInLibsFound) {
          libsFound.push(lib);
        }
      }
    }

    return {
      result: codeWithProcessedLines.result,
      libsFound,
    };
  }

  async processLine(code: string, pathFile: string): Promise<IProcessResult> {
    const libsFound: string[] = [];
    const lines = code.split('\n');
    let result = ``;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      let libLine = libs.find(lib => line.indexOf(lib) !== -1);

      // lib verify
      if (libLine) {
        libsFound.push(libLine);
      }

      if (!libLine) {
        // key verify
        const key = keys.find(key => line.includes(key));
        if (line.startsWith(key)) {
          const data: IProcessResult = await this['key_' + key](line, pathFile);
          result += data.result;
          libsFound.push(data.libsFound[0]);
        } else {
          result += `${line}\n`;
        }
      }
    }
    return {
      result,
      libsFound,
    };
  }

  private async key_import(
    code: string,
    pathFile: string,
  ): Promise<IProcessResult> {
    if (!code) return;
    let pathFromCode: string = eval(
      code.substring(code.indexOf('from'), code.length).split(' ')[1],
    );
    const isStyle = pathFromCode.indexOf('style') !== -1;
    if (isStyle) {
      pathFromCode = pathFile.replace('index.jsx', '') + 'styles.js';
    }
    const pathFromCodeArray: string[] = pathFromCode.split('/');
    for (let i = 0; i < pathFromCode.length; i++) {
      if (pathFromCodeArray[i] === '..') {
        pathFromCodeArray.splice(i, 1);
        i--;
      }
    }
    const absolutePath: string = path.resolve(
      this.basePath,
      ...pathFromCodeArray,
      isStyle ? '' : 'index.jsx',
    );
    const nextFile = await this.babel(absolutePath);
    return nextFile;
  }

  lib_styled_components(code: string, pathFile: string): string {
    return code;
  }
}
