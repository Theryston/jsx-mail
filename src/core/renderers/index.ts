import { ReadAllFiles } from './geral/ReadAllFiles';
import { MountDirectoryTree } from '../../utils/MountDirectoryTree';
import { GetContentFilesInDirectories } from '../../utils/GetContentFilesInDirectories';

import { IDirectoryTree, IFileContentTree } from '../../interfaces/IDirectory';

export class App {
  private appPath: string;

  public appDirectoryTree: IDirectoryTree;

  private appFileContentTree: IFileContentTree;

  constructor(path: string) {
    this.appPath = path;
  }

  async build() {
    this.appDirectoryTree = await MountDirectoryTree.execute(this.appPath);
    this.appFileContentTree = await GetContentFilesInDirectories.execute(
      this.appDirectoryTree,
    );
    const data = await ReadAllFiles.execute(this.appFileContentTree);
    console.log(data);
  }
}
