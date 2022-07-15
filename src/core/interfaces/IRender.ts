export interface IRender {
  run(
    templateName: string,
    variables?: {
      [key: string]: any;
    },
  ): Promise<string>;
}
