import CoreError from "../utils/error";
import esbuild from 'esbuild';
import { changePathExt, copyFileAndCreateFolder, createFileWithFolder, createFolder, exists, getAllFilesByDirectory, getBaseCorePath, getRelativePath, getTemplateFolder, joinPath, readFile } from "../utils/file-system"
import handleErrors from "../utils/handle-errors";

export default async function build(dirPath: string) {
  try {
    const { baseCorePath, outDirFolder } = await handleInitialPaths(dirPath);

    const allJsxFiles = await getJsxFiles(dirPath);

    const compilationWarnings = await transformJsxFiles(allJsxFiles, baseCorePath, dirPath, outDirFolder);

    await copyAllNotJsxFiles(dirPath, outDirFolder);

    return {
      outDir: outDirFolder,
      warnings: compilationWarnings
    }
  } catch (error) {
    handleErrors(error);
  }
}

async function copyAllNotJsxFiles(dirPath: string, outDirFolder: string) {
  const allNoJsxFiles = await getAllFilesByDirectory(dirPath, {
    excludeExtensions: ['jsx', 'tsx']
  });

  for (const noJsxFile of allNoJsxFiles) {
    const relativePath = await getRelativePath(dirPath, noJsxFile.path);

    const outPath = await joinPath(outDirFolder, relativePath);

    await copyFileAndCreateFolder(noJsxFile.path, outPath);
  }
}

async function transformJsxFiles(allJsxFiles: { path: string; ext: string; }[], baseCorePath: string, dirPath: string, outDirFolder: string) {
  const compilationWarnings = [];

  for (const jsxFile of allJsxFiles) {
    const fileCode = await readFile(jsxFile.path);

    const coreRelativePath = await getRelativePath(jsxFile.path, baseCorePath);

    const builtFile = await transformCode(fileCode, coreRelativePath, jsxFile);

    if (builtFile.warnings) {
      for (const warning of builtFile.warnings) {
        compilationWarnings.push({
          ...jsxFile,
          ...warning
        });
      }
    }

    const jsFilePath = await changePathExt(jsxFile.path, 'js');

    const relativePath = await getRelativePath(dirPath, jsFilePath);

    const builtPath = await joinPath(outDirFolder, relativePath);

    await createFileWithFolder(builtPath, builtFile.code);
  }

  return compilationWarnings;
}

async function transformCode(fileCode: string, coreRelativePath: string, jsxFile: { path: string; ext: string; }) {
  let builtFile;
  try {
    builtFile = await esbuild.transform(fileCode, {
      jsxFactory: 'jsx',
      jsx: 'automatic',
      jsxImportSource: coreRelativePath.replace(/\\/g, '/'),
      format: 'cjs',
      loader: jsxFile.ext as 'jsx' | 'tsx'
    });
  } catch (error: any) {
    throw new CoreError('compilation_error', {
      errors: error.errors,
      warnings: error.warnings
    });
  }
  return builtFile;
}

async function getJsxFiles(dirPath: string) {
  const allJsxFiles = await getAllFilesByDirectory(dirPath, {
    extensions: ['jsx', 'tsx']
  });

  if (!allJsxFiles || !allJsxFiles.length) {
    throw new CoreError('no_tsx_or_jsx_files');
  }
  return allJsxFiles;
}

async function handleInitialPaths(dirPath: string) {
  const templateFolderPath = await getTemplateFolder(dirPath);

  if (!templateFolderPath) {
    throw new CoreError('no_template_folder');
  }

  const baseCorePath = await getBaseCorePath();
  const outDirFolder = await joinPath(baseCorePath, 'mail-app-built');
  const outDirFolderExists = await exists(outDirFolder);

  if (!outDirFolderExists) {
    await createFolder(outDirFolder);
  }
  return { baseCorePath, outDirFolder };
}
