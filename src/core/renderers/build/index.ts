import { IBuild } from './IBuild';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';

export class Build implements IBuild {
  constructor(private readonly jsxTransform: IJsxTransform) {}

  async directory(sourcePath: string, outputDir: string): Promise<void> {
    await this.jsxTransform.directory(sourcePath, outputDir);
  }
}
