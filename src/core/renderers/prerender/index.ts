import { IPrerender } from '../../interfaces/IPrerender';
import { transform } from './transform';

export class Prerender implements IPrerender {
  constructor(private inputPath: string, private outputPath: string) {}

  async run() {
    await transform(this.inputPath, this.outputPath);
  }
}
