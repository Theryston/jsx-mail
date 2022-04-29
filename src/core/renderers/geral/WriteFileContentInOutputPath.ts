import path from 'path';
import {
  IDirectoryTree,
  IJSXMailContentTree,
} from '../../../interfaces/IDirectory';
import fs from 'fs';

const DEFAULT_OUTPUT_PATH = path.resolve('dist-email-jsx');

export class WriteFileContentInOutputPath {
  // TODO: imports correct file from path
  async execute(fileContentTree: IJSXMailContentTree): Promise<IDirectoryTree> {
    await this.createFolderRootIfNotExists();

    const jsxMailTree: IDirectoryTree = {
      folders: [],
      files: [],
      path: DEFAULT_OUTPUT_PATH,
    };

    for (const file of fileContentTree.files) {
      const filePath = path.resolve(
        DEFAULT_OUTPUT_PATH,
        path.parse(file.filePath).base + Date.now() + '.js',
      );
      await fs.writeFileSync(filePath, file.fileJSXMail);
      jsxMailTree.files.push(filePath);
    }

    for (const folder of fileContentTree.folders) {
      const folderJSXMail = await this.execute(folder);
      jsxMailTree.folders.push(folderJSXMail);
    }

    return jsxMailTree;
  }

  async createFolderRootIfNotExists() {
    if (!(await fs.existsSync(DEFAULT_OUTPUT_PATH))) {
      await fs.mkdirSync(DEFAULT_OUTPUT_PATH);
    }
  }
}
