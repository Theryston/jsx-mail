import CoreError from "../utils/error";
import esbuild from 'esbuild';
import { changePathExt, copyFileAndCreateFolder, createFileWithFolder, createFolder, exists, getAllFilesByDirectory, getBaseCorePath, getRelativePath, getTemplateFolder, joinPath, readFile } from "../utils/file-system"
import handleErrors from "../utils/handle-errors";
import load from "../utils/load";

type Options = {
  log?: boolean
}

export default async function prepare(dirPath: string, options?: Options) {
  const { log } = options || {}

  try {
    startLoad(log);

    const { baseCorePath, outDirFolder } = await handleInitialPaths(dirPath);

    const allJsxFiles = await getJsxFiles(dirPath);

    const compilationWarnings = await transformJsxFiles(allJsxFiles, baseCorePath, dirPath, outDirFolder, log);

    await copyAllNotJsxFiles(dirPath, outDirFolder, log);

    successLoad(log);

    return {
      outDir: outDirFolder,
      warnings: compilationWarnings
    }
  } catch (error) {
    handleErrors(error, log, load);
  }
}

function successLoad(log: boolean | undefined) {
  if (log) {
    load.succeed('Prepare ran successfully');
  }
}

function startLoad(log: boolean | undefined) {
  if (log) {
    load.start('Getting infos about the mail app...');
  }
}

async function copyAllNotJsxFiles(dirPath: string, outDirFolder: string, log?: boolean) {
  const allNoJsxFiles = await getAllFilesByDirectory(dirPath, {
    excludeExtensions: ['jsx', 'tsx']
  });

  for (const noJsxFile of allNoJsxFiles) {
    const relativePath = await getRelativePath(dirPath, noJsxFile.path);

    if (log) {
      load.text = `Copying file ${relativePath} to built folder...`
    }

    const outPath = await joinPath(outDirFolder, relativePath);

    await copyFileAndCreateFolder(noJsxFile.path, outPath);
  }
}

async function transformJsxFiles(allJsxFiles: { path: string; ext: string; }[], baseCorePath: string, dirPath: string, outDirFolder: string, log?: boolean) {
  const compilationWarnings = [];

  for (const jsxFile of allJsxFiles) {
    const relativeJsxPath = await getRelativePath(dirPath, jsxFile.path);

    transformFileLog(log, relativeJsxPath);

    const fileCode = await readFile(jsxFile.path);

    const coreRelativePath = await getRelativePath(jsxFile.path, baseCorePath);

    const builtFile = await transformCodeAndHandleError(fileCode, coreRelativePath, jsxFile);

    if (builtFile.warnings) {
      for (const warning of builtFile.warnings) {
        compilationWarnings.push({
          ...jsxFile,
          ...warning
        });
      }
    }

    const jsFilePath = await changePathExt(jsxFile.path, 'js');

    const relativeJsPath = await getRelativePath(dirPath, jsFilePath);

    const builtPath = await joinPath(outDirFolder, relativeJsPath);

    await createFileWithFolder(builtPath, builtFile.code);
  }

  return compilationWarnings;
}

function transformFileLog(log: boolean | undefined, relativeJsxPath: string) {
  if (log) {
    load.text = `Building file ${relativeJsxPath}...`;
  }
}

async function transformCodeAndHandleError(fileCode: string, coreRelativePath: string, jsxFile: { path: string; ext: string; }) {
  try {
    return await transformCode(fileCode, coreRelativePath, jsxFile);
  } catch (error: any) {
    handleErrorTransform(error);
  }
}

async function transformCode(fileCode: string, coreRelativePath: string, jsxFile: { path: string; ext: string; }) {
  const builtFile: any = await esbuild.transform(fileCode, {
    jsxFactory: 'jsx',
    jsx: 'automatic',
    jsxImportSource: coreRelativePath.replace(/\\/g, '/'),
    format: 'cjs',
    loader: jsxFile.ext as 'jsx' | 'tsx'
  });

  return builtFile
}

function handleErrorTransform(error: any) {
  throw new CoreError('compilation_error', {
    errors: error.errors,
    warnings: error.warnings
  });
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
