import { IRender } from './IRender';
import path from 'path';
import fs from 'fs';
import { ReactRender } from './ReactRender/index';
import { IMailAppConfig } from '../../interfaces/IMailApp';

export class Render implements IRender {
  constructor(private inputPath: string, private config?: any) {}

  async run(templateName: string, variables?: any): Promise<string> {
    const indexFilePath = path.join(this.inputPath, 'index.js');

    if (!fs.existsSync(indexFilePath)) {
      throw new Error('Index file not found, run "jsxm build"');
    }

    const indexFile = await import(indexFilePath);

    const mailAppConfig: IMailAppConfig = indexFile.default();

    const template = mailAppConfig[templateName];

    if (!template) {
      throw new Error('Template not found: ' + templateName);
    }

    const reactRender = new ReactRender(template.componentFunction, variables);

    const { htmlCode, styleTag } = await reactRender.run();

    const resultCode = `
    <!DOCTYPE html>
    <html lang="${this.config?.lang || 'en'}">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
        <title>${templateName}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
        ${styleTag}
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
    `;

    return resultCode.replace(/\n/g, '');
  }
}
