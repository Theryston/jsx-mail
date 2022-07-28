import { IBuilder } from './IBuilder';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';

export class Builder implements IBuilder {
  constructor(private readonly jsxTransform: IJsxTransform) {}

  async directory(sourcePath: string, outputDir: string): Promise<void> {
    await this.jsxTransform.directory(sourcePath, outputDir);
  }
}
