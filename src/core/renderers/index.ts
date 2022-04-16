import { BuildFileJSXToJS } from './geral/BuildFileJSXToJS';
import { MountDirectoryTree } from '../../utils/MountDirectoryTree';
import { GetContentFilesInDirectories } from '../../utils/GetContentFilesInDirectories';

import { IDirectoryTree, IFileContentTree } from '../../interfaces/IDirectory';

export class App {
  private cwd: string;

  private appPath: string;

  public appDirectoryTree: IDirectoryTree;

  private appFileContentTree: IFileContentTree;

  constructor(path: string) {
    this.appPath = path;
    this.cwd = process.cwd();
  }

  async build() {
    this.appDirectoryTree = await MountDirectoryTree.execute(this.appPath);
    this.appFileContentTree = await GetContentFilesInDirectories.execute(
      this.appDirectoryTree,
    );
    console.log(process.cwd());
    const data = await BuildFileJSXToJS.execute(this.appFileContentTree);
    console.log(data.folders[0].folders[0].files[0].fileJSXMail);
    // process.chdir(data.folderPath);
    // eval(data.files[0].fileJSXMail);
    // process.chdir(this.cwd);
  }
}
