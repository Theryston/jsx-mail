export interface IJsxTransform {
  directory(
    sourcePath: string,
    outputDir: string,
    options?: IJsxTransformOptions
  ): Promise<void>;
  file(
    path: string,
    outputDir: string,
    options?: IJsxTransformOptions
  ): Promise<void>;
  code(
    code: string,
    options?: IJsxTransformOptions
  ): Promise<string | null | undefined>;
}

export interface IJsxTransformOptions {
  customRuntime?: string;
}
