export interface IDirectoryTree {
  folders: IDirectoryTree[];
  files: string[];
  path: string;
}

export interface IFileContent {
  filePath: string;
  fileContent: string;
}

export interface IFileContentTree {
  folders: IFileContentTree[];
  folderPath: string;
  files: IFileContent[];
}
