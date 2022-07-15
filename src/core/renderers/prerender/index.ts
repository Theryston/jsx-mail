import { IPrerender } from '../../interfaces/IPrerender';
import { Transform } from './Transform';

export class Prerender implements IPrerender {
  transform: Transform;

  constructor(private inputPath: string, private outputPath: string) {
    this.transform = new Transform();
  }

  async run() {
    await this.transform.run(this.inputPath, this.outputPath);
  }
}
