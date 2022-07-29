import { IBuilder } from './IBuilder';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';
import { IHtmlChecker } from '../checkers/HtmlChecker/IHtmlChecker';

export class Builder implements IBuilder {
  constructor(
    private htmlChecker: IHtmlChecker,
    private readonly jsxTransform: IJsxTransform,
  ) {}

  async directory(sourcePath: string, outputDir: string): Promise<void> {
    const htmlCheckerResult = await this.htmlChecker.directory(sourcePath);
    if (htmlCheckerResult.hasUnexpected) {
      throw new Error(
        `HTML checker found unexpected HTML in ${sourcePath}\n${JSON.stringify(
          htmlCheckerResult,
        )}`,
      );
    }
    await this.jsxTransform.directory(sourcePath, outputDir);
  }
}
