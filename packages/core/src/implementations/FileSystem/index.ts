import fs from 'fs';
import { IDirectoryTree, IFileSystem, IFileSystemOptions } from './IFileSystem';
import path from 'path';

export class FileSystem implements IFileSystem {
  async getAllDirectoryTree(
    basePath: string,
    options?: IFileSystemOptions
  ): Promise<IDirectoryTree[]> {
    const { justFilenameInFilePath = false, fileExtensions = [] } =
      options || {};

    const entities = await fs.promises.readdir(basePath, {
      withFileTypes: true,
    });
    const directoryTree: IDirectoryTree[] = [];
    for (const entity of entities) {
      const entityPath = path.join(basePath, entity.name);
      if (entity.isDirectory()) {
        const children = await this.getAllDirectoryTree(entityPath, options);
        directoryTree.push({
          children,
          path: entityPath,
          type: 'directory',
        });
      } else {
        if (justFilenameInFilePath) {
          if (
            fileExtensions.length === 0 ||
            fileExtensions.includes(entityPath.split('.').pop())
          ) {
            directoryTree.push({
              children: [],
              path: path.basename(entityPath),
              type: 'file',
            });
          }
        } else {
          if (
            fileExtensions.length === 0 ||
            fileExtensions.includes(entityPath.split('.').pop())
          ) {
            directoryTree.push({
              children: [],
              path: entityPath,
              type: 'file',
            });
          }
        }
      }
    }

    return directoryTree;
  }

  async writeFile(inputPath: string, content: string): Promise<void> {
    const directory = path.dirname(inputPath);
    if (!fs.existsSync(directory)) {
      await fs.promises.mkdir(directory, { recursive: true });
    }
    await fs.promises.writeFile(inputPath, content, 'utf8');
  }

  async readUtf8File(inputPath: string): Promise<string> {
    return await fs.promises.readFile(inputPath, 'utf8');
  }

  async exists(inputPath: string): Promise<boolean> {
    return fs.existsSync(inputPath);
  }

  async rm(inputPath: string): Promise<void> {
    // eslint-disable-next-line
    await (fs.promises as any).rm(inputPath, { recursive: true, force: true });
  }

  // eslint-disable-next-line
  async importFile(inputPath: string): Promise<any> {
    return await import(inputPath);
  }
}
