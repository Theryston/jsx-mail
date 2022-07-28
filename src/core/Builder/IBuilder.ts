export interface IBuilder {
  directory(sourcePath: string, outputDir: string): Promise<void>;
}
