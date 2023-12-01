import path from 'path';
import fs from 'fs';
import url from 'url';
import mime from 'mime-types';

const NO_TEMPLATE_FILE_NAME = ['styles'];

declare const __dirname: string;

type GetAllFilesByDirectoryOptions = {
  extensions?: string[];
  excludeExtensions?: string[];
};

type GetAllFilesByDirectoryFile = {
  path: string;
  ext: string;
};

export function joinPath(...paths: string[]) {
  return path.join(...paths);
}

export function getBaseCorePath() {
  const currentPath = __dirname;

  const distPath = joinPath(currentPath, '..');

  return distPath;
}

export async function createFolder(pathDir: string) {
  await fs.promises.mkdir(pathDir);
}

export async function exists(pathExists: string) {
  return fs.existsSync(pathExists);
}

export async function isDirectory(filePath: string) {
  const stat = await fs.promises.stat(filePath);
  return stat.isDirectory();
}

export async function getAllFilesByDirectory(
  pathDir: string,
  options?: GetAllFilesByDirectoryOptions,
) {
  const { extensions, excludeExtensions } = options || {};

  const files: GetAllFilesByDirectoryFile[] = [];
  const entries = await fs.promises.readdir(pathDir);

  for (const entry of entries) {
    const entryPath = await joinPath(pathDir, entry);
    const isEntryDirectory = await isDirectory(entryPath);

    if (isEntryDirectory) {
      const subFiles = await getAllFilesByDirectory(entryPath, options);
      files.push(...subFiles);
    } else {
      const fileExt = entry.split('.').pop() as string;

      if (extensions && extensions.length && !extensions.includes(fileExt)) {
        continue;
      }

      if (
        excludeExtensions &&
        excludeExtensions.length &&
        excludeExtensions.includes(fileExt)
      ) {
        continue;
      }

      files.push({
        path: entryPath,
        ext: fileExt,
      });
    }
  }

  return files;
}

export async function getTemplateFolder(pathDir: string) {
  const templateFolderPath = await joinPath(pathDir, 'templates');
  const existsTemplateFolder = await exists(templateFolderPath);

  if (!existsTemplateFolder) {
    return null;
  }

  return templateFolderPath;
}

export async function getAllTemplates(pathDir: string) {
  const templateFolderPath = await getTemplateFolder(pathDir);

  if (!templateFolderPath) {
    return [];
  }

  const allFilesIntoTemplate = await getAllFilesByDirectory(
    templateFolderPath,
    {
      extensions: ['js', 'ts', 'jsx', 'tsx'],
    },
  );

  const templateFiles = [];

  for (const templateFile of allFilesIntoTemplate) {
    const fileName = await extractFileName(templateFile.path);

    if (NO_TEMPLATE_FILE_NAME.includes(fileName)) {
      continue;
    }

    templateFiles.push(templateFile);
  }

  return templateFiles;
}

async function extractFileName(filePath: string) {
  const fileNameWithExt = path.basename(filePath);
  return path.parse(fileNameWithExt).name;
}

export async function readFile(filePath: string) {
  return await fs.promises.readFile(filePath, {
    encoding: 'utf8',
  });
}

export function readImage(filePath: string) {
  return fs.readFileSync(filePath);
}

export function getFileSize(filePath: string) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

export async function deleteFolder(folderPath: string) {
  await fs.promises.rm(folderPath, {
    recursive: true,
  });
}

export async function transformChildrenFileToPath(folderPath: string) {
  const files = await getAllFilesByDirectory(folderPath);
  const file = files[0];

  if (!file) {
    return;
  }

  const coreBasePath = getBaseCorePath();
  const temp = joinPath(coreBasePath, 'temp');

  const tempFileName = `${Date.now()}.${file.ext}`;
  const tempImage = joinPath(temp, tempFileName);

  await copyFileAndCreateFolder(file.path, tempImage);

  await fs.promises.rm(folderPath, {
    recursive: true,
  });

  await fs.promises.rename(tempImage, folderPath);

  return folderPath;
}

export function getFileMimetype(filePath: string) {
  return mime.lookup(filePath);
}

export async function createFileWithFolder(
  filePath: string,
  fileContent: string,
) {
  const folder = path.dirname(filePath);
  const existsFolder = await exists(folder);

  if (!existsFolder) {
    await fs.promises.mkdir(folder, {
      recursive: true,
    });
  }

  await fs.promises.writeFile(filePath, fileContent);
}

export async function getRelativePath(from: string, to: string) {
  return path.relative(from, to);
}

export async function changePathExt(filePath: string, newExt: string) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const newPath = path.join(path.dirname(filePath), `${fileName}.${newExt}`);
  return newPath;
}

export function getFileExt(filePath: string) {
  return path.extname(filePath);
}

export async function copyFileAndCreateFolder(
  originFilePath: string,
  destinationFilePath: string,
) {
  const folder = path.dirname(destinationFilePath);
  const existsFolder = await exists(folder);

  if (!existsFolder) {
    await fs.promises.mkdir(folder, {
      recursive: true,
    });
  }

  const originFileBytes = await fs.promises.readFile(originFilePath);

  await fs.promises.writeFile(destinationFilePath, originFileBytes);
}

export async function getFileUrl(filePath: string) {
  return url.pathToFileURL(filePath).href;
}
