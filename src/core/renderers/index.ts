import { ReadAllFiles } from './geral/ReadAllFiles';
import { ObjectOrganizerByFileId } from './geral/ObjectOrganizerByFileId';
import path from 'path';

export class App {
  private path: string;
  private readAllFiles: ReadAllFiles;
  private objectOrganizerByFileId: ObjectOrganizerByFileId;

  constructor(path: string) {
    this.path = path;
    this.readAllFiles = new ReadAllFiles(path);
  }

  async build() {
    const data = await this.readAllFiles.babel(
      path.resolve(this.path, 'app.jsx'),
    );
    this.objectOrganizerByFileId = new ObjectOrganizerByFileId(data.result);
    const filesHtml = await this.objectOrganizerByFileId.execute();
  }
}
