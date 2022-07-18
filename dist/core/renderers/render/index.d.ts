import { IRender } from '../../interfaces/IRender';
export declare class Render implements IRender {
    private inputPath;
    constructor(inputPath: string);
    run(templateName: string, variables?: any): Promise<string>;
}
