import { IBuild } from '../../interfaces/IBuild';
import { Transform } from './Transform';
export declare class Build implements IBuild {
    private inputPath;
    private outputPath;
    transform: Transform;
    constructor(inputPath: string, outputPath: string);
    run(): Promise<void>;
}
