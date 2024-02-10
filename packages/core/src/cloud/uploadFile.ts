import CoreError from '../utils/error';
import { getFileMimetype, readRawFile } from '../utils/file-system';
import formData from 'form-data';
import client from './client';
import path from 'path';
import { StorageData } from '../prepare';

export async function uploadFile({ path: filePath, originalPath }: StorageData): Promise<string> {
  try {
    const file = readRawFile(filePath);
    const form = new formData();
    form.append('file', file);
    const fileName = path.basename(originalPath);
    const mimeType = getFileMimetype(filePath);

    form.append('_jsxmail_mimetype', mimeType);
    form.append('_jsxmail_originalname', fileName);

    const response = await client.post('/file', form, {
      headers: form.getHeaders(),
    });

    return response.data.url
  } catch (error: any) {
    throw new CoreError('upload_error', {
      error: error.response.data ? error.response.data : error.message,
    });
  }
}
