import { IBuilder, IBuilderResult } from './IBuilder';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';
import { IHtmlChecker } from '../checkers/HtmlChecker/IHtmlChecker';
import { ICssChecker } from '../checkers/CssChecker/ICssChecker';

export class Builder implements IBuilder {
  constructor(
    private htmlChecker: IHtmlChecker,
    private readonly jsxTransform: IJsxTransform,
    private readonly cssChecker: ICssChecker,
  ) {}

  async directory(
    sourcePath: string,
    outputDir: string,
  ): Promise<IBuilderResult> {
    const htmlCheckerResult = await this.htmlChecker.directory(sourcePath);
    const cssCheckerResult = await this.cssChecker.directory(sourcePath);
    await this.jsxTransform.directory(sourcePath, outputDir);
    return {
      htmlCheckerResult,
      cssCheckerResult,
    };
  }
}
