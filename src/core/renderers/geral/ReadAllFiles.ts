import { IFileContentTree } from '../../../interfaces/IDirectory';

interface IProcessResult {
  result: string;
  libsFound: string[];
}

export class ReadAllFiles {
  static async execute(
    fileContentTree: IFileContentTree,
  ): Promise<IProcessResult> {
    console.log(fileContentTree);

    return {
      result: '',
      libsFound: [],
    };
  }
}
