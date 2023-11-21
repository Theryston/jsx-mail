import path from 'path';
import fs from 'fs';

declare const __dirname: string;

export async function joinPath(...paths: string[]) {
  return path.join(...paths)
}

export async function getBaseCorePath() {
  const currentPath = __dirname;

  const distPath = joinPath(currentPath, '..')

  return distPath
}

export async function createFolder(pathDir: string) {
  await fs.promises.mkdir(pathDir)
}

export async function exists(pathExists: string) {
  return fs.existsSync(pathExists)
}