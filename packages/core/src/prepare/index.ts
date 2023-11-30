import CoreError from '../utils/error';
import esbuild from 'esbuild';
import {
  changePathExt,
  copyFileAndCreateFolder,
  createFileWithFolder,
  createFolder,
  exists,
  getAllFilesByDirectory,
  getAllTemplates,
  getBaseCorePath,
  getFileUrl,
  getRelativePath,
  getTemplateFolder,
  joinPath,
  readFile,
} from '../utils/file-system';
import handleErrors from '../utils/handle-errors';
import {
  cleanAllGlobalVariables,
  cleanGlobalVariable,
  insertGlobalVariableItem,
  readGlobalVariable,
} from '../utils/global';
import handleImagesImport from '../utils/handle-images-import';
import getStorage from '../utils/storage';
import { ImageInfo } from '..';
import { cloudUploadImage } from '../cloud/image/upload';

handleImagesImport();

type CompileFilePath = 'jsx' | 'tsx' | 'js' | 'ts';

const COMPILE_FILES_EXT: CompileFilePath[] = ['jsx', 'tsx', 'js', 'ts'];

type StorageType = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: (path: string, hash: string) => Promise<string>;
};

type ProcessName =
  | 'checking_mail_app_folder'
  | 'checking_compile_files'
  | 'compiling_file'
  | 'compiled_file'
  | 'copying_file'
  | 'copied_file'
  | 'looking_for_images'
  | 'uploading_image'
  | 'image_uploaded'
  | 'running_template'
  | 'template_executed';

type AllOptions = {
  onProcessChange: (
    // eslint-disable-next-line no-unused-vars
    processName: ProcessName,
    // eslint-disable-next-line no-unused-vars
    data: { [key: string]: any },
  ) => void;
  ignoreCloud: boolean;
};

type Options = Partial<AllOptions>;

export default async function prepare(dirPath: string, options?: Options) {
  const { onProcessChange, ignoreCloud } = getOptions(options);

  try {
    insertGlobalVariableItem('state', {
      id: 'prepare',
    });

    handleIgnoreCloud(ignoreCloud);

    const { baseCorePath, builtMailAppPath } = await handleInitialPaths(
      dirPath,
      onProcessChange,
    );

    const allCompileFiles = await getCompileFiles(dirPath, onProcessChange);

    const esbuildWarnings = await transformCompileFiles(
      allCompileFiles,
      baseCorePath,
      dirPath,
      builtMailAppPath,
      onProcessChange,
    );

    await copyAllNotCompileFiles(dirPath, builtMailAppPath, onProcessChange);

    await prepareImages(builtMailAppPath, onProcessChange, ignoreCloud);

    await executeAllTemplates(builtMailAppPath, onProcessChange);

    const warnings = readGlobalVariable('__jsx_mail_warnings');

    cleanAllGlobalVariables();

    return {
      outDir: builtMailAppPath,
      esbuildWarnings,
      warnings,
    };
  } catch (error) {
    handleErrors(error);
  }
}

function handleIgnoreCloud(ignoreCloud: boolean) {
  const storage = getStorage();

  if (!ignoreCloud) {
    storage.removeItem('ignoreCloud');
    return;
  }

  storage.setItem('images', '[]');
  storage.setItem('ignoreCloud', 'true');
}

async function prepareImages(
  builtMailAppPath: string,
  onProcessChange: AllOptions['onProcessChange'],
  ignoreCloud: boolean,
) {
  insertGlobalVariableItem('onlyTag', {
    id: 'img',
  });

  await executeAllTemplates(builtMailAppPath, (processName, data) => {
    if (processName === 'running_template') {
      onProcessChange('looking_for_images', data);
    }
  });

  cleanGlobalVariable('onlyTag');

  const storage = getStorage();
  const imagesString = storage.getItem('images');
  let images: ImageInfo[] = JSON.parse(imagesString || '[]');
  const changedImages: ImageInfo[] = [];

  for (const image of images) {
    if (!['pending_upload', 'error'].includes(image.status)) {
      continue;
    }

    try {
      const imageUrl = await uploadImage(
        image,
        onProcessChange,
        images,
        ignoreCloud,
      );

      image.url = imageUrl;
      image.status = 'uploaded';
      delete image.error;
    } catch (error: any) {
      image.status = 'error';
      if (error.response?.data) {
        image.error = error.response.data;
      } else {
        image.error = error;
      }
    }

    changedImages.push(image);
  }

  const imagesError = images.filter((i) => i.status === 'error');

  if (imagesError.length) {
    throw images[0]?.error;
  }

  const oldImagesStr = storage.getItem('images');
  const oldImages = JSON.parse(oldImagesStr || '[]');
  const newImages = oldImages.map((oldImage: ImageInfo) => {
    const newImage = changedImages.find(
      (changedImage) => changedImage.hash === oldImage.hash,
    );

    if (newImage) {
      return newImage;
    }

    return oldImage;
  });

  storage.setItem('images', JSON.stringify(newImages));
}

async function uploadImage(
  imagesToUpload: ImageInfo,
  onProcessChange: AllOptions['onProcessChange'],
  allImages: ImageInfo[],
  ignoreCloud: boolean,
): Promise<string> {
  if (ignoreCloud) {
    return imagesToUpload.path;
  }

  onProcessChange('uploading_image', {
    ...imagesToUpload,
    images: allImages,
  });

  const storageType: StorageType = {
    JSX_MAIL_CLOUD: cloudUploadImage,
  };

  const uploadImage =
    // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
    storageType[process.env.JSX_MAIL_STORAGE_TYPE || 'JSX_MAIL_CLOUD'];

  if (!uploadImage) {
    throw new CoreError('invalid_storage_type');
  }

  const url = await uploadImage(imagesToUpload.path, imagesToUpload.hash);

  onProcessChange('image_uploaded', {
    ...imagesToUpload,
    url,
    images: allImages,
  });

  return url;
}

async function executeAllTemplates(
  builtMailAppPath: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  const allTemplatesFiles = await getAllTemplates(builtMailAppPath);

  for (const templateFile of allTemplatesFiles) {
    const templateFileUrl = await getFileUrl(templateFile.path);

    onProcessChange('running_template', {
      ...templateFile,
      templateFileUrl,
    });

    const { default: templateImport } = await import(templateFileUrl);

    const component = getComponent(
      templateImport,
      templateFile,
      templateFileUrl,
    );

    const props = templateImport.props;

    executeComponent(
      component,
      props,
      onProcessChange,
      templateFile,
      templateFileUrl,
    );
  }
}

function executeComponent(
  component: any,
  props: any,
  onProcessChange: AllOptions['onProcessChange'],
  templateFile: { path: string; ext: string },
  templateFileUrl: string,
) {
  try {
    const result = component(props);

    if (result instanceof Promise) {
      throw new CoreError('promise_not_allowed');
    }

    onProcessChange('template_executed', {
      ...templateFile,
      templateFileUrl,
      virtualDOM: result,
    });
  } catch (error) {
    if (error instanceof CoreError) {
      throw error;
    } else {
      throw new CoreError('fails_to_run_template_in_prepare', {
        path: templateFile.path,
        templateFileUrl,
        error,
      });
    }
  }
}

function getComponent(
  templateImport: any,
  templateFile: { path: string; ext: string },
  templateFileUrl: string,
) {
  const component = templateImport.default;

  if (!component || typeof component !== 'function') {
    throw new CoreError('export_a_component_as_default', {
      templateBuiltPath: templateFile.path,
      templateBuiltUrl: templateFileUrl,
    });
  }
  return component;
}

function getOptions(options: Options | undefined): AllOptions {
  const newOptions = {
    onProcessChange: () => {
      return;
    },
    ignoreCloud: false,
    ...options,
  };

  return newOptions;
}

async function copyAllNotCompileFiles(
  dirPath: string,
  outDirFolder: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  const allNoCompileFiles = await getAllFilesByDirectory(dirPath, {
    excludeExtensions: COMPILE_FILES_EXT,
  });

  for (const noCompileFile of allNoCompileFiles) {
    const relativePath = await getRelativePath(dirPath, noCompileFile.path);

    const outPath = await joinPath(outDirFolder, relativePath);

    onProcessChange('copying_file', {
      relativePath,
      path: noCompileFile.path,
      destinationPath: outPath,
    });

    await copyFileAndCreateFolder(noCompileFile.path, outPath);

    onProcessChange('copied_file', {
      relativePath,
      path: noCompileFile.path,
      destinationPath: outPath,
    });
  }
}

async function transformCompileFiles(
  allCompileFiles: { path: string; ext: string }[],
  baseCorePath: string,
  dirPath: string,
  outDirFolder: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  const esbuildWarnings = [];

  for (const compileFile of allCompileFiles) {
    const relativeCompilePath = await getRelativePath(
      dirPath,
      compileFile.path,
    );

    const jsFilePath = await changePathExt(compileFile.path, 'js');

    const relativeJsPath = await getRelativePath(dirPath, jsFilePath);

    const builtPath = await joinPath(outDirFolder, relativeJsPath);

    onProcessChange('compiling_file', {
      relativePath: relativeCompilePath,
      destinationPath: builtPath,
      ...compileFile,
    });

    const fileCode = await readFile(compileFile.path);

    const coreRelativePath = await getRelativePath(
      compileFile.path,
      baseCorePath,
    );

    const builtFile = await transformCodeAndHandleError(
      fileCode,
      coreRelativePath,
      compileFile,
    );

    onProcessChange('compiled_file', {
      relativePath: relativeCompilePath,
      destinationPath: builtPath,
      code: builtFile.code,
      ...compileFile,
    });

    if (builtFile.warnings) {
      for (const warning of builtFile.warnings) {
        esbuildWarnings.push({
          ...compileFile,
          ...warning,
        });
      }
    }

    await createFileWithFolder(builtPath, builtFile.code);
  }

  return esbuildWarnings;
}

async function transformCodeAndHandleError(
  fileCode: string,
  coreRelativePath: string,
  compileFile: { path: string; ext: string },
) {
  try {
    return await transformCode(fileCode, coreRelativePath, compileFile);
  } catch (error: any) {
    handleErrorTransform(error);
  }
}

async function transformCode(
  fileCode: string,
  coreRelativePath: string,
  compileFile: { path: string; ext: string },
) {
  const builtFile: any = await esbuild.transform(fileCode, {
    jsxFactory: 'jsx',
    jsx: 'automatic',
    jsxImportSource: coreRelativePath.replace(/\\/g, '/'),
    format: 'cjs',
    loader: compileFile.ext as CompileFilePath,
  });

  return builtFile;
}

function handleErrorTransform(error: any) {
  throw new CoreError('compilation_error', {
    errors: error.errors,
    warnings: error.warnings,
  });
}

async function getCompileFiles(
  dirPath: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  onProcessChange('checking_compile_files', {
    dirPath,
  });
  const allCompileFiles = await getAllFilesByDirectory(dirPath, {
    extensions: COMPILE_FILES_EXT,
  });

  if (!allCompileFiles || !allCompileFiles.length) {
    throw new CoreError('compile_files');
  }
  return allCompileFiles;
}

async function handleInitialPaths(
  dirPath: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  onProcessChange('checking_mail_app_folder', {
    dirPath,
  });

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
