import { ICssChecker, ICssCheckerResult } from './ICssChecker';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';
import { IFileSystem } from '../../implementations/FileSystem/IFileSystem';
import { IMailAppConfig } from '../../../interfaces/IMailApp';
import path from 'path';
import {
  IComponentJson,
  IComponentJsonRender,
} from '../../implementations/ComponentJsonRender/IComponentJsonRender';
import { cssSecurityList } from './cssSecurityList';

export class CssChecker implements ICssChecker {
  constructor(
    private jsxTransform: IJsxTransform,
    private fileSystem: IFileSystem,
    private componentJsonRender: IComponentJsonRender,
  ) {}

  async directory(sourcePath: string): Promise<ICssCheckerResult> {
    let response: ICssCheckerResult = {
      hasUnexpected: false,
      unexpectedAttributes: [],
    };
    await this.jsxTransform.directory(sourcePath, 'css-check');
    if (
      !this.fileSystem.exists(path.join(sourcePath, 'css-check', 'index.js'))
    ) {
      throw new Error('index.js not found');
    }
    const indexCode = await this.fileSystem.importFile(
      path.join(sourcePath, 'css-check', 'index.js'),
    );

    if (!indexCode.default) {
      throw new Error('index.js does not have default export');
    }

    const mailApp: IMailAppConfig = indexCode.default();
    for (let templateName of Object.keys(mailApp)) {
      const template = mailApp[templateName];
      const result = await this.componentJsonRender.fromComponent(
        template.componentFunction,
        template.props,
      );
      response = await this.componentJson(result);
    }
    await this.fileSystem.rm(path.join(sourcePath, 'css-check'));
    return response;
  }

  async componentJson(
    componentJson: IComponentJson,
  ): Promise<ICssCheckerResult> {
    const response: ICssCheckerResult = {
      hasUnexpected: false,
      unexpectedAttributes: [],
    };

    if (!componentJson) {
      return response;
    }

    if (componentJson.styles) {
      for (let styleItem of componentJson.styles) {
        const styleItemName = styleItem.key;
        const styleItemValue = styleItem.value;
        const styleItemSecurity = cssSecurityList[styleItemName];
        if (!styleItemSecurity) {
          response.hasUnexpected = true;
          response.unexpectedAttributes.push({
            attributeName: styleItemName,
            unexpectedValues: [],
          });
        } else if (
          styleItemSecurity[0] !== '*' &&
          styleItemSecurity.indexOf(styleItemValue) === -1
        ) {
          response.hasUnexpected = true;
          response.unexpectedAttributes.push({
            attributeName: styleItemName,
            unexpectedValues: [styleItemValue],
          });
        }
      }
    }

    if (componentJson.children) {
      for (let child of componentJson.children) {
        const childResult = await this.componentJson(child);
        if (childResult.hasUnexpected) {
          response.hasUnexpected = true;
          response.unexpectedAttributes.push(
            ...childResult.unexpectedAttributes,
          );
        }
      }
    }

    return response;
  }
}
