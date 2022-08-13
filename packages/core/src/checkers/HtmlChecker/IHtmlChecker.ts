import { IComponentJson } from '../../implementations/ComponentJsonRender/IComponentJsonRender';

export interface IHtmlChecker {
  directory(sourcePath: string): Promise<IHtmlCheckerResult>;
  componentJson(componentJson: IComponentJson): Promise<IHtmlCheckerResult>;
}

export interface IHtmlCheckerResult {
  hasUnexpected: boolean;
  unexpectedTags: {
    tagName: string;
    unexpectedProps: string[];
  }[];
}
