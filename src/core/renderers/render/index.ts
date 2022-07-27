import { IRender } from './IRender';
import path from 'path';
import fs from 'fs';
import { ReactRender } from './ReactRender';
import { IMailAppConfig } from '../../../interfaces/IMailApp';

export class Render implements IRender {
  constructor(private inputPath: string) {}

  async run(templateName: string, variables?: any): Promise<string> {
    const indexFilePath = path.join(this.inputPath, 'index.js');

    if (!fs.existsSync(indexFilePath)) {
      throw new Error('Index file not found');
    }

    const indexFile = await import(indexFilePath);

    const mailAppConfig: IMailAppConfig = indexFile.default();

    const template = mailAppConfig[templateName];

    if (!template) {
      throw new Error('Template not found: ' + templateName);
    }

    const reactRender = new ReactRender(template.componentFunction, variables);

    const { htmlCode, styleTag } = await reactRender.run();

    return `<!DOCTYPE html><html><head><title>${templateName}</title>${styleTag}</head><body>${htmlCode}</body></html>`;
  }
}
