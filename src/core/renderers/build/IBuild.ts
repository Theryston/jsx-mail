export interface IBuild {
  directory(sourcePath: string, outputDir: string): Promise<void>;
}
