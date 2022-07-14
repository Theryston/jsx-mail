import { IDirectoryTree } from './IFileSystem';

export interface IPrerender {
  run(): Promise<IDirectoryTree[]>;
}
