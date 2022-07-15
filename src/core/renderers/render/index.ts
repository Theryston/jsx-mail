import { IRender } from '../../interfaces/IRender';
import path from 'path';
import fs from 'fs';
import { ReactRender } from './ReactRender';

export class Render implements IRender {
  constructor(private inputPath: string) {}

  async run(templateName: string, variables?: any): Promise<string> {
    const indexFilePath = path.join(this.inputPath, 'index.js');

    if (!fs.existsSync(indexFilePath)) {
      throw new Error('Index file not found');
    }

    const indexFile = await import(indexFilePath);

    const templateReactElement = indexFile[templateName];

    if (!templateReactElement) {
      throw new Error('Template not found: ' + templateName);
    }

    const reactRender = new ReactRender(templateReactElement, variables);

    const { htmlCode, styleTag } = await reactRender.run();

    return `<!DOCTYPE html><html><head><title>${templateName}</title>${styleTag}</head><body>${htmlCode}</body></html>`;
  }
}