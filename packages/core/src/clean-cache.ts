import { getToken } from './cloud/get-token';
import { setToken } from './cloud/set-token';
import {
  deleteFolder,
  exists,
  getBaseCorePath,
  joinPath,
} from './utils/file-system';
import { cleanAllGlobalVariables } from './utils/global';
import getStorage from './utils/storage';

export default async function cleanCache() {
  cleanAllGlobalVariables();
  const baseCorePath = getBaseCorePath();
  const storage = getStorage();

  const token = getToken();

  storage.clear();

  if (token) {
    setToken(token);
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
