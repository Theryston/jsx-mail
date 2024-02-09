import axios from 'axios';
import {
  getFileMimetype,
  getFileSize,
  readImage,
} from '../../utils/file-system';
import CoreError from '../../utils/error';
import { WEBSITE_URL } from '../../utils/cloud';

export async function cloudUploadImage(
  path: string,
  hash: string,
): Promise<string> {
  const mimeType = getFileMimetype(path);

  if (!mimeType) {
    throw new CoreError('invalid_file_type');
  }

  const fileSize = getFileSize(path);

  try {
    const body = {
      hash,
      size: fileSize,
      mimetype: mimeType,
    };
    const { data: cloudImage } = await axios.post(
      `${WEBSITE_URL}/api/image`,
      body,
    );

    const { url, upload_url } = cloudImage;

    if (!upload_url) {
      return url;
    }

    const file = await readImage(path);
    await axios.put(upload_url, file, {
      headers: {
        'Content-Type': mimeType,
      },
    });

    return url;
  } catch (error: any) {
    throw new CoreError('upload_error', {
      error: error.response.data ? error.response.data : error.message,
    });
  }
}
