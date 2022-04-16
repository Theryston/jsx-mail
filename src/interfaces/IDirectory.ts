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

export interface IJSXMailContent {
  filePath: string;
  fileJSXMail: string;
}

export interface IJSXMailContentTree {
  folders: IJSXMailContentTree[];
  files: IJSXMailContent[];
  folderPath: string;
}
