import { IFileSystem, IDirectoryTree } from '../../interfaces/IFileSystem';
import { IPrerender } from '../../interfaces/IPrerender';

export class Prerender implements IPrerender {
  constructor(
    private inputPath: string,
    private outputPath: string,
    private fileSystem: IFileSystem,
  ) {}

  async run(): Promise<IDirectoryTree[]> {
    // TODO: get directory tree
    // TODO: get js files
    // TODO: build tsx in js
    // TODO: write js files in same structure of inicial directory but with .js extension and in base path 'dist/prerender'
    return [
      {
        absolutePath: '.js',
        type: 'directory',
        children: [],
      },
    ];
  }
}
