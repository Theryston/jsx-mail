import { IComponentJson } from '../../implementations/ComponentJsonRender/IComponentJsonRender';

export interface ICssChecker {
  directory(sourcePath: string): Promise<ICssCheckerResult>;
  componentJson(componentJson: IComponentJson): Promise<ICssCheckerResult>;
}

export interface ICssCheckerResult {
  hasUnexpected: boolean;
  unexpectedAttributes: {
    attributeName: string;
    unexpectedValues: string[];
  }[];
}
