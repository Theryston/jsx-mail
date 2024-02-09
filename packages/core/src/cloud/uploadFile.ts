// import {
//   readImage,
// } from '../utils/file-system';
import CoreError from '../utils/error';

export async function uploadFile(
  // path: string,
  // hash: string,
): Promise<string> {
  try {
    // TODO: upload image
    const url = '';
    return url;
  } catch (error: any) {
    throw new CoreError('upload_error', {
      error: error.response.data ? error.response.data : error.message,
    });
  }
}
