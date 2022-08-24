import { Builder } from './Builder/index';
import { Render } from './renderers/render/index';
import { FileSystem } from './implementations/FileSystem/index';
import { JsxTransform } from './implementations/JsxTransform/index';
import { HtmlChecker } from './checkers/HtmlChecker/index';
import { CssChecker } from './checkers/CssChecker/index';
import { ComponentJsonRender } from './implementations/ComponentJsonRender/index';
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
      componentJsonRender
    );
    const cssChecker = new CssChecker(
      jsxTransform,
      fileSystem,
      componentJsonRender
    );

    const builder = new Builder(htmlChecker, jsxTransform, cssChecker);

    const result = await builder.directory(this.inputPath, this.outputDirname);

    return result;
  }

  public async render(templateName: string, variables?: any, config?: any) {
    const render = new Render(
      path.join(this.inputPath, this.outputDirname),
      config
    );
    const htmlCode = await render.run(templateName, variables);
    return htmlCode;
  }
}
