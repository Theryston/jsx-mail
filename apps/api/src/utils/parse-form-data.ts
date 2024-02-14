import Busboy from 'busboy';

export const parseFormData = async ({
  body,
  isBase64Encoded,
  contentType,
}): Promise<any> =>
  new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: { 'content-type': contentType } });

    const fields: Record<string, any> = {};
    let uploadedFile: any;

    busboy.on('file', (field, file, filename, encoding, contentType) => {
      let content = '';

      file.on('data', (data) => {
        content = data;
      });

      file.on('error', reject);

      file.on('end', () => {
        uploadedFile = {
          field,
          filename,
          encoding,
          contentType,
          content,
        };
      });
    });

    busboy.on('field', (fieldName, value) => {
      fields[fieldName] = value;
    });

    busboy.on('error', reject);

    busboy.on('finish', () => {
      resolve({ file: uploadedFile, fields });
    });

    busboy.write(body || '', isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
  });
