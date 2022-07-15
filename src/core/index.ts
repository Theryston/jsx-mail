import { Build } from './renderers/build';

export class App {
  constructor(private inputPath: string, private outputPath: string) {}

  public async build() {
    const build = new Build(this.inputPath, this.outputPath);

    await build.run();
  }
}
