import {
  deleteFolder,
  exists,
  getBaseCorePath,
  joinPath,
} from './utils/file-system';
import { cleanAllGlobalVariables } from './utils/global';

export default async function cleanCache() {
  cleanAllGlobalVariables();
  const baseCorePath = getBaseCorePath();

  const storagePath = joinPath(baseCorePath, 'cache');
  const existsStorage = await exists(storagePath);

  if (existsStorage) {
    await deleteFolder(storagePath);
  }

  const mailAppPath = joinPath(baseCorePath, 'mail-app-built');
  const existsMailApp = await exists(mailAppPath);

  if (existsMailApp) {
    await deleteFolder(mailAppPath);
  }

  const optimizedImagesPath = joinPath(baseCorePath, 'optimized-images');
  const existsOptimizedImages = await exists(optimizedImagesPath);

  if (existsOptimizedImages) {
    await deleteFolder(optimizedImagesPath);
  }

  const tempPath = joinPath(baseCorePath, 'temp');
  const existsTemp = await exists(tempPath);

  if (existsTemp) {
    await deleteFolder(tempPath);
  }
}
