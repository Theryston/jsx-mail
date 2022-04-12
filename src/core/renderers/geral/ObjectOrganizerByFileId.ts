export class ObjectOrganizerByFileId {
  fileString: string;

  constructor(fileString: string) {
    this.fileString = fileString;
  }

  async execute(): Promise<string> {
    const lines = this.fileString.split('\n');
    let result = ``;

    let startAt = 0;
    let endAt = 0;

    let lastId = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.indexOf('@JSXMailFileId') !== -1) {
        const id = line
          .substring(line.indexOf('@JSXMailFileId') + 15, line.length)
          .replace('*/', '');
        if (id !== lastId) {
          startAt = this.fileString.indexOf(line);
          lastId = id;
        } else {
          endAt = this.fileString.indexOf(line);
        }
      }

      const stringFile = this.fileString.substring(startAt, endAt);
      console.log(stringFile);
      console.log('\n\n\n');

      result += `${line}\n`;
    }

    // console.log(result);

    return result;
  }
}
