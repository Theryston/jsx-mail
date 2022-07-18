export declare class Core {
    private inputPath;
    private outputPath;
    constructor(inputPath: string, outputPath: string);
    build(): Promise<void>;
    render(templateName: string, variables?: any): Promise<string>;
}
