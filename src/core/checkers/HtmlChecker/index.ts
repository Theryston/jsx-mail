import { IHtmlChecker, IHtmlCheckerResult } from './IHtmlChecker';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';
import { IFileSystem } from '../../implementations/FileSystem/IFileSystem';
import { IMailAppConfig } from '../../../interfaces/IMailApp';
import path from 'path';
import {
  IReactJson,
  IReactJsonRender,
} from '../../implementations/ReactJsonRender/IReactJsonRender';
import { htmlSecurityList } from './htmlSecurityList';

export class HtmlChecker implements IHtmlChecker {
  constructor(
    private jsxTransform: IJsxTransform,
    private fileSystem: IFileSystem,
    private reactJsonRender: IReactJsonRender,
  ) {}

  async directory(sourcePath: string): Promise<IHtmlCheckerResult> {
    let response: IHtmlCheckerResult = {
      hasUnexpected: false,
      unexpectedTags: [],
    };
    await this.jsxTransform.directory(sourcePath, 'html-check');
    if (
      !this.fileSystem.exists(path.join(sourcePath, 'html-check', 'index.js'))
    ) {
      throw new Error('index.js not found');
    }
    const indexCode = await this.fileSystem.importFile(
      path.join(sourcePath, 'html-check', 'index.js'),
    );

    if (!indexCode.default) {
      throw new Error('index.js does not have default export');
    }

    const mailApp: IMailAppConfig = indexCode.default();
    for (let templateName of Object.keys(mailApp)) {
      const template = mailApp[templateName];
      const result = await this.reactJsonRender.fromComponent(
        template.componentFunction,
        template.props,
      );
      response = await this.reactJson(result);
    }
    await this.fileSystem.rm(path.join(sourcePath, 'html-check'));
    return response;
  }

  async reactJson(reactJson: IReactJson): Promise<IHtmlCheckerResult> {
    const response: IHtmlCheckerResult = {
      hasUnexpected: false,
      unexpectedTags: [],
    };

    if (!reactJson.type) {
      return response;
    }

    const tag = Object.keys(htmlSecurityList).find(
      tag => tag === reactJson.type,
    );

    if (!tag) {
      response.hasUnexpected = true;
      response.unexpectedTags.push({
        tagName: reactJson.type,
        unexpectedProps: [],
      });
      return response;
    }

    for (let prop of Object.keys(reactJson.props)) {
      const propName = htmlSecurityList[tag].find(
        propName => propName === prop,
      );
      if (!propName) {
        response.hasUnexpected = true;
        response.unexpectedTags.push({
          tagName: reactJson.type,
          unexpectedProps: [prop],
        });
        return response;
      }
    }

    for (let child of reactJson.children) {
      const childResult = await this.reactJson(child);
      if (childResult.hasUnexpected) {
        response.hasUnexpected = true;
        response.unexpectedTags.push(...childResult.unexpectedTags);
      }
    }

    return response;
  }
}
