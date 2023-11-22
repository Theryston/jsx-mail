import path from 'path';
import fs from 'fs';

declare const __dirname: string;

type GetAllFilesByDirectoryOptions = {
  extensions?: string[]
  excludeExtensions?: string[]
}

type GetAllFilesByDirectoryFile = {
  path: string
  ext: string
}

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

export async function getAllFilesByDirectory(pathDir: string, options?: GetAllFilesByDirectoryOptions) {
  const { extensions, excludeExtensions } = options || {};

  const files: GetAllFilesByDirectoryFile[] = [];
  const entries = await fs.promises.readdir(pathDir);

  for (const entry of entries) {
    const entryPath = await joinPath(pathDir, entry);
    const stat = await fs.promises.stat(entryPath);

    if (stat.isDirectory()) {
      const subFiles = await getAllFilesByDirectory(entryPath, options);
      files.push(...subFiles)
    } else {
      const fileExt = entry.split('.').pop() as string;

      if (extensions && extensions.length && !extensions.includes(fileExt)) {
        continue;
      }

      if (excludeExtensions && excludeExtensions.length && excludeExtensions.includes(fileExt)) {
        continue;
      }


      files.push({
        path: entryPath,
        ext: fileExt,
      });
    }
  }

  return files
}

export async function getTemplateFolder(pathDir: string) {
  const templateFolderPath = await joinPath(pathDir, 'templates')
  const existsTemplateFolder = await exists(templateFolderPath)

  if (!existsTemplateFolder) {
    return null
  }

  return templateFolderPath
}

export async function readFile(filePath: string) {
  return await fs.promises.readFile(filePath, {
    encoding: 'utf8'
  })
}

export async function createFileWithFolder(filePath: string, fileContent: string) {
  const folder = path.dirname(filePath)
  const existsFolder = await exists(folder)

  if (!existsFolder) {
    await fs.promises.mkdir(folder, {
      recursive: true
    })
  }

  await fs.promises.writeFile(filePath, fileContent)
}

export async function getRelativePath(from: string, to: string) {
  return path.relative(from, to)
}

export async function changePathExt(filePath: string, newExt: string) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const newPath = path.join(path.dirname(filePath), `${fileName}.${newExt}`);
  return newPath;
}

export async function copyFileAndCreateFolder(originFilePath: string, destinationFilePath: string) {
  const folder = path.dirname(destinationFilePath)
  const existsFolder = await exists(folder)

  if (!existsFolder) {
    await fs.promises.mkdir(folder, {
      recursive: true
    })
  }

  const originFileBytes = await fs.promises.readFile(originFilePath)

  await fs.promises.writeFile(destinationFilePath, originFileBytes)
}