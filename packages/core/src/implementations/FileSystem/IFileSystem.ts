export interface IFileSystem {
  getAllDirectoryTree(
    basePath: string,
    options?: IFileSystemOptions
  ): Promise<IDirectoryTree[]>;
  writeFile(path: string, content: string): Promise<void>;
  readUtf8File(path: string): Promise<string>;
  exists(path: string): Promise<boolean>;
  rm(path: string): Promise<void>;
  importFile(path: string): Promise<any>;
}

export interface IFileSystemOptions {
  justFilenameInFilePath?: boolean;
  fileExtensions?: string[];
}

export interface IDirectoryTree {
  path: string;
  children: IDirectoryTree[];
  type: 'file' | 'directory';
}
