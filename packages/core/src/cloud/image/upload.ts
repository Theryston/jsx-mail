import axios from 'axios';
import {
  getFileMimetype,
  getFileSize,
  readImage,
} from '../../utils/file-system';
import CoreError from '../../utils/error';
import WEBSITE_URL from '../../utils/website-url';
import { cleanGlobalVariable, readGlobalVariable } from '../../utils/global';
import getStorage from '../../utils/storage';
import { ImageInfo } from '../..';

export async function cloudUploadImage(
  path: string,
  hash: string,
): Promise<string> {
  const mimeType = getFileMimetype(path);

  if (!mimeType) {
    throw new CoreError('invalid_file_type');
  }

  const fileSize = getFileSize(path);

  await deleteNotUsedImages();

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
    await axios.put(upload_url, file);

    return url;
  } catch (error: any) {
    throw new CoreError('upload_error', {
      error: error.response.data ? error.response.data : error.message,
    });
  }
}

async function deleteNotUsedImages() {
  try {
    const imagesUsing = readGlobalVariable('images_using');

    if (!imagesUsing || !imagesUsing.length) {
      return;
    }

    const storage = getStorage();

    if (!storage) {
      return;
    }

    const imagesStr = storage.getItem('images');
    let images = imagesStr ? JSON.parse(imagesStr) : [];
    let newImages: ImageInfo[] = [];

    for (const image of images) {
      const notUsed =
        !imagesUsing.find((i) => i.id === image.hash) &&
        image.status === 'uploaded';

      if (!notUsed) {
        newImages.push(image);
        continue;
      }

      await axios.delete(`${WEBSITE_URL}/api/image`, {
        params: {
          hash: image.hash,
        },
      });
    }

    storage.setItem('images', JSON.stringify(newImages));
    cleanGlobalVariable('images_using');
  } catch (error: any) {
    console.error('Error deleting not used images');
  }
}
