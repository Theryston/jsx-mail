import { LocalStorage } from 'node-localstorage';
import { getBaseCorePath, joinPath } from './file-system';

export type StorageType = typeof LocalStorage;

export default function getStorage() {
  const baseCorePath = getBaseCorePath();
  const storage = new LocalStorage(joinPath(baseCorePath, 'cache'));

  return storage;
}
