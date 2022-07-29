import { IReactJson } from '../../implementations/ReactJsonRender/IReactJsonRender';

export interface IHtmlChecker {
  directory(sourcePath: string): Promise<IHtmlCheckerResult>;
  reactJson(reactJson: IReactJson): Promise<IHtmlCheckerResult>;
}

export interface IHtmlCheckerResult {
  hasUnexpected: boolean;
  unexpectedTags: {
    tagName: string;
    unexpectedProps: string[];
  }[];
}
