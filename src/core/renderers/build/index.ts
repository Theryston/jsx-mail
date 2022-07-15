import { IBuild } from '../../interfaces/IBuild';
import { Transform } from './Transform';

export class Build implements IBuild {
  transform: Transform;

  constructor(private inputPath: string, private outputPath: string) {
    this.transform = new Transform();
  }

  async run() {
    await this.transform.run(this.inputPath, this.outputPath);
  }
}
