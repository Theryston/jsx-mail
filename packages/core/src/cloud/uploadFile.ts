import CoreError from '../utils/error';
import { readRawFile } from '../utils/file-system';
import formData from 'form-data';
import client from './client';

export async function uploadFile(
  path: string,
): Promise<string> {
  try {
    const file = readRawFile(path);
    const form = new formData();
    form.append('file', file);

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
