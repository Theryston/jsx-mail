export interface IDirectoryTree {
  absolutePath: string;
  type: 'file' | 'directory';
  children: IDirectoryTree[];
}

export interface IFileSystem {
  getDirectoryTree(path: string): Promise<IDirectoryTree[]>;
}
