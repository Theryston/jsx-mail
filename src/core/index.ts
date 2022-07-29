import { Builder } from './Builder';
import { Render } from './renderers/render';
import { FileSystem } from './implementations/FileSystem';
import { JsxTransform } from './implementations/JsxTransform';
import { HtmlChecker } from './checkers/HtmlChecker';
import { ReactJsonRender } from './implementations/ReactJsonRender';
import path from 'path';

export class Core {
  constructor(private inputPath: string, private outputDirname: string) {}

  public async build() {
    const fileSystem = new FileSystem();
    const jsxTransform = new JsxTransform(fileSystem);
    const reactJsonRender = new ReactJsonRender();
    const htmlChecker = new HtmlChecker(
      jsxTransform,
      fileSystem,
      reactJsonRender,
    );
    const builder = new Builder(htmlChecker, jsxTransform);

    await builder.directory(this.inputPath, this.outputDirname);
  }

  public async render(templateName: string, variables?: any) {
    const render = new Render(path.join(this.inputPath, this.outputDirname));
    const htmlCode = await render.run(templateName, variables);
    return htmlCode;
  }
}
