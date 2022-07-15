import { Build } from './renderers/build';
import { Render } from './renderers/render';

export class Core {
  constructor(private inputPath: string, private outputPath: string) {}

  public async build() {
    const build = new Build(this.inputPath, this.outputPath);

    await build.run();
  }

  public async render(templateName: string, variables?: any) {
    const render = new Render(this.inputPath);
    const htmlCode = await render.run(templateName, variables);
    return htmlCode;
  }
}
