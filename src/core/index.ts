import { Prerender } from './renderers/prerender';

export class App {
  constructor(private inputPath: string, private outputPath: string) {}

  public async prerender() {
    const prerender = new Prerender(this.inputPath, this.outputPath);

    await prerender.run();
  }
}
