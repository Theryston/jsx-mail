import storage from 'node-persist';
import { getBaseCorePath, joinPath } from './file-system';

export type StorageType = typeof storage;

export default async function getStorage() {
  const baseCorePath = await getBaseCorePath();
  await storage.init({
    dir: await joinPath(baseCorePath, 'cache'),
  });

  return storage;
}
