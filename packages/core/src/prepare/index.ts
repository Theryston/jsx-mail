import CoreError from "../utils/error";
import esbuild from 'esbuild';
import { changePathExt, copyFileAndCreateFolder, createFileWithFolder, createFolder, exists, getAllFilesByDirectory, getBaseCorePath, getFileUrl, getRelativePath, getTemplateFolder, joinPath, readFile } from "../utils/file-system"
import handleErrors from "../utils/handle-errors";
import getStorage, { StorageType } from "../utils/storage";

type ProcessName = 'checking_mail_app_folder' | 'checking_jsx_files' | 'compiling_file' | 'copying_file' | 'running_template'

type Options = {
  // eslint-disable-next-line no-unused-vars
  onProcessChange: (processName: ProcessName, data: { [key: string]: string }) => void
}

export default async function prepare(dirPath: string, options?: Options) {
  const { onProcessChange } = getOptions(options)

  try {
    const storage = await setupTempStorage();

    const { baseCorePath, builtMailAppPath } = await handleInitialPaths(dirPath, onProcessChange);

    const allJsxFiles = await getJsxFiles(dirPath, onProcessChange);

    const compilationWarnings = await transformJsxFiles(allJsxFiles, baseCorePath, dirPath, builtMailAppPath, onProcessChange);

    await copyAllNotJsxFiles(dirPath, builtMailAppPath, onProcessChange);

    await executeTemplates(builtMailAppPath, onProcessChange)

    await cleanTempStorage(storage);

    return {
      outDir: builtMailAppPath,
      warnings: compilationWarnings
    }
  } catch (error) {
    handleErrors(error);
  }
}

async function setupTempStorage() {
  const storage = await getStorage();

  await storage.setItem('CURRENT_PROCESS', 'PREPARING');

  return storage;
}

async function cleanTempStorage(storage: StorageType) {
  await storage.removeItem('CURRENT_PROCESS');
}

async function executeTemplates(builtMailAppPath: string, onProcessChange: Options['onProcessChange']) {
  const templateFolderPath = await getTemplateFolder(builtMailAppPath)

  const allTemplatesFiles = await getAllFilesByDirectory(templateFolderPath as string, {
    extensions: ['js']
  })

  for (const templateFile of allTemplatesFiles) {
    const templateFileUrl = await getFileUrl(templateFile.path)

    onProcessChange('running_template', {
      ...templateFile,
      templateFileUrl
    })

    const { default: templateImport } = await import(templateFileUrl)

    const component = getComponent(templateImport, templateFile, templateFileUrl);

    const props = templateImport.props

    try {
      await component(props)
    } catch (error) {
      throw new CoreError('fails_to_run_template_in_prepare', {
        path: templateFile.path,
        templateFileUrl,
        error
      });
    }
  }
}

function getComponent(templateImport: any, templateFile: { path: string; ext: string; }, templateFileUrl: string) {
  const component = templateImport.default;

  if (!component || typeof component !== 'function') {
    throw new CoreError('export_a_component_as_default', {
      templateBuiltPath: templateFile.path,
      templateBuiltUrl: templateFileUrl
    });
  }
  return component;
}

function getOptions(options: Options | undefined): { onProcessChange: Options['onProcessChange']; } {
  return options || {
    onProcessChange: () => { }
  };
}

async function copyAllNotJsxFiles(dirPath: string, outDirFolder: string, onProcessChange: Options['onProcessChange']) {
  const allNoJsxFiles = await getAllFilesByDirectory(dirPath, {
    excludeExtensions: ['jsx', 'tsx']
  });

  for (const noJsxFile of allNoJsxFiles) {
    const relativePath = await getRelativePath(dirPath, noJsxFile.path);

    const outPath = await joinPath(outDirFolder, relativePath);


    onProcessChange('copying_file', {
      relativePath,
      path: noJsxFile.path,
      destinationPath: outPath
    })

    await copyFileAndCreateFolder(noJsxFile.path, outPath);
  }
}

async function transformJsxFiles(allJsxFiles: { path: string; ext: string; }[], baseCorePath: string, dirPath: string, outDirFolder: string, onProcessChange: Options['onProcessChange']) {
  const compilationWarnings = [];

  for (const jsxFile of allJsxFiles) {
    const relativeJsxPath = await getRelativePath(dirPath, jsxFile.path);

    const jsFilePath = await changePathExt(jsxFile.path, 'js');

    const relativeJsPath = await getRelativePath(dirPath, jsFilePath);

    const builtPath = await joinPath(outDirFolder, relativeJsPath);

    onProcessChange('compiling_file', {
      relativePath: relativeJsxPath,
      destinationPath: builtPath,
      ...jsxFile
    })

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

    await createFileWithFolder(builtPath, builtFile.code);
  }

  return compilationWarnings;
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

async function getJsxFiles(dirPath: string, onProcessChange: Options['onProcessChange']) {
  onProcessChange('checking_jsx_files', {
    dirPath
  })
  const allJsxFiles = await getAllFilesByDirectory(dirPath, {
    extensions: ['jsx', 'tsx']
  });

  if (!allJsxFiles || !allJsxFiles.length) {
    throw new CoreError('no_tsx_or_jsx_files');
  }
  return allJsxFiles;
}

async function handleInitialPaths(dirPath: string, onProcessChange: Options['onProcessChange']) {
  onProcessChange('checking_mail_app_folder', {
    dirPath
  })

  const templateFolderPath = await getTemplateFolder(dirPath);

  if (!templateFolderPath) {
    throw new CoreError('no_template_folder');
  }

  const baseCorePath = await getBaseCorePath();
  const builtMailAppPath = await joinPath(baseCorePath, 'mail-app-built');
  const outDirFolderExists = await exists(builtMailAppPath);

  if (!outDirFolderExists) {
    await createFolder(builtMailAppPath);
  }

  return { baseCorePath, builtMailAppPath };
}