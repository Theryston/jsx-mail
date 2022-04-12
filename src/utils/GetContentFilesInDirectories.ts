import { IDirectoryTree, IFileContentTree } from '../interfaces/IDirectory';
import fs from 'fs';

export class GetContentFilesInDirectories {
  static async execute(
    directoryTree: IDirectoryTree,
  ): Promise<IFileContentTree> {
    const foldersContent: IFileContentTree = {
      folders: [],
      files: [],
      folderPath: directoryTree.path,
    };

    for (const file of directoryTree.files) {
      const fileContent = await fs.readFileSync(file, 'utf8');
      foldersContent.files.push({
        fileContent,
        filePath: file,
      });
    }

    for (const folder of directoryTree.folders) {
      const folderContent = await this.execute(folder);
      foldersContent.folders.push(folderContent);
    }

    return foldersContent;
  }
}
