import { IHtmlChecker, IHtmlCheckerResult } from './IHtmlChecker';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';
import { IFileSystem } from '../../implementations/FileSystem/IFileSystem';
import { IMailAppConfig } from '../../interfaces/IMailApp';
import path from 'path';
import {
  IComponentJson,
  IComponentJsonRender,
} from '../../implementations/ComponentJsonRender/IComponentJsonRender';
import { htmlSecurityList } from './htmlSecurityList';

export class HtmlChecker implements IHtmlChecker {
  constructor(
    private jsxTransform: IJsxTransform,
    private fileSystem: IFileSystem,
    private componentJsonRender: IComponentJsonRender
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
      path.join(sourcePath, 'html-check', 'index.js')
    );

    if (!indexCode.default) {
      throw new Error('index.js does not have default export');
    }

    const mailApp: IMailAppConfig = indexCode.default();
    for (const templateName of Object.keys(mailApp)) {
      const template = mailApp[templateName];
      const result = await this.componentJsonRender.fromComponent(
        template.componentFunction,
        template.props
      );
      response = await this.componentJson(result);
    }
    await this.fileSystem.rm(path.join(sourcePath, 'html-check'));
    return response;
  }

  async componentJson(
    componentJson: IComponentJson
  ): Promise<IHtmlCheckerResult> {
    const response: IHtmlCheckerResult = {
      hasUnexpected: false,
      unexpectedTags: [],
    };

    if (!componentJson) {
      return response;
    }

    if (!componentJson.type) {
      return response;
    }

    const tag = Object.keys(htmlSecurityList).find(
      (tag) => tag === componentJson.type
    );

    if (!tag) {
      response.hasUnexpected = true;
      response.unexpectedTags.push({
        tagName: componentJson.type,
        unexpectedProps: [],
      });
      return response;
    }

    for (const prop of Object.keys(componentJson.props)) {
      const propName = htmlSecurityList[tag].find(
        (propName) => propName === prop
      );
      if (!propName) {
        response.hasUnexpected = true;
        response.unexpectedTags.push({
          tagName: componentJson.type,
          unexpectedProps: [prop],
        });
        return response;
      }
    }

    for (const child of componentJson.children) {
      const childResult = await this.componentJson(child);
      if (childResult.hasUnexpected) {
        response.hasUnexpected = true;
        response.unexpectedTags.push(...childResult.unexpectedTags);
      }
    }

    return response;
  }
}
