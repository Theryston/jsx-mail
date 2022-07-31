import { IBuilder, IBuilderResult } from './IBuilder';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';
import { IHtmlChecker } from '../checkers/HtmlChecker/IHtmlChecker';

export class Builder implements IBuilder {
  constructor(
    private htmlChecker: IHtmlChecker,
    private readonly jsxTransform: IJsxTransform,
  ) {}

  async directory(
    sourcePath: string,
    outputDir: string,
  ): Promise<IBuilderResult> {
    const htmlCheckerResult = await this.htmlChecker.directory(sourcePath);
    await this.jsxTransform.directory(sourcePath, outputDir);
    return {
      htmlCheckerResult,
    };
  }
}
