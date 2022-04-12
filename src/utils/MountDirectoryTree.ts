import fs from 'fs';
import path from 'path';

import { IDirectoryTree } from '../interfaces/IDirectory';

export class MountDirectoryTree {
  static async execute(directoryPath: string): Promise<IDirectoryTree> {
    const filesPath: string[] = await fs.readdirSync(directoryPath);
    const folders: IDirectoryTree[] = [];
    const files = [];

    for (const pathFound of filesPath) {
      const absolutePath = path.resolve(directoryPath, pathFound);
      const stats = await fs.statSync(absolutePath);
      if (stats.isDirectory()) {
        const directoryTreeFound = await this.execute(absolutePath);
        folders.push(directoryTreeFound);
      } else {
        files.push(absolutePath);
      }
    }

    const directoryTree: IDirectoryTree = {
      folders: folders,
      files: files,
      path: directoryPath,
    };

    return directoryTree;
  }
}
