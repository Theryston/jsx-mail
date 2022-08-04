import { Builder } from './Builder';
import { Render } from './renderers/render';
import { FileSystem } from './implementations/FileSystem';
import { JsxTransform } from './implementations/JsxTransform';
import { HtmlChecker } from './checkers/HtmlChecker';
import { CssChecker } from './checkers/CssChecker';
import { ComponentJsonRender } from './implementations/ComponentJsonRender';
import path from 'path';

export class Core {
  constructor(private inputPath: string, private outputDirname: string) {}

  public async build() {
    const fileSystem = new FileSystem();
    const jsxTransform = new JsxTransform(fileSystem);
    const componentJsonRender = new ComponentJsonRender();
    const htmlChecker = new HtmlChecker(
      jsxTransform,
      fileSystem,
      componentJsonRender,
    );
    const cssChecker = new CssChecker(
      jsxTransform,
      fileSystem,
      componentJsonRender,
    );

    const builder = new Builder(htmlChecker, jsxTransform, cssChecker);

    const result = await builder.directory(this.inputPath, this.outputDirname);

    return result;
  }

  public async render(templateName: string, variables?: any) {
    const render = new Render(path.join(this.inputPath, this.outputDirname));
    const htmlCode = await render.run(templateName, variables);
    return htmlCode;
  }
}
