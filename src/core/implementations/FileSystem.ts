import fs from 'fs';

import { IDirectoryTree, IFileSystem } from '../interfaces/IFileSystem';

export class FileSystem implements IFileSystem {
  getDirectoryTree(path: string): Promise<IDirectoryTree[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(path, async (err, files) => {
        if (err) {
          reject(err);
        }

        const directoryTree: IDirectoryTree[] = [];

        for (const file of files) {
          const absolutePath = `${path}/${file}`;

          const stats = fs.statSync(absolutePath);

          if (stats.isFile()) {
            directoryTree.push({
              absolutePath,
              type: 'file',
              children: [],
            });
          } else if (stats.isDirectory()) {
            directoryTree.push({
              absolutePath,
              type: 'directory',
              children: await this.getDirectoryTree(absolutePath),
            });
          }
        }

        resolve(directoryTree);
      });
    });
  }
}
