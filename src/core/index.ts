import { IFileSystem } from './interfaces/IFileSystem';
import { Prerender } from './renderers/prerender';
import { FileSystem } from './implementations/FileSystem';

export class App {
  fileSystem: IFileSystem;

  constructor(private inputPath: string, private outputPath: string) {
    this.fileSystem = new FileSystem();
  }

  public async prerender() {
    const prerender = new Prerender(
      this.inputPath,
      this.outputPath,
      this.fileSystem,
    );

    await prerender.run();
  }
}
