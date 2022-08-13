import { ICssCheckerResult } from '../checkers/CssChecker/ICssChecker';
import { IHtmlCheckerResult } from '../checkers/HtmlChecker/IHtmlChecker';

export interface IBuilder {
  directory(sourcePath: string, outputDir: string): Promise<IBuilderResult>;
}

export interface IBuilderResult {
  htmlCheckerResult: IHtmlCheckerResult;
  cssCheckerResult: ICssCheckerResult;
}
