import CoreError from '../utils/error';
import esbuild from 'esbuild';
import {
  bufferToBase64,
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
  readImage,
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
import NodeFormData from 'form-data';
import axios from 'axios';

handleImagesImport();

type CompileFilePath = 'jsx' | 'tsx' | 'js' | 'ts';

const COMPILE_FILES_EXT: CompileFilePath[] = ['jsx', 'tsx', 'js', 'ts'];
const JSX_MAIL_IMGBB_API_KEY = '753d982d37fff6345371be3c4fff3b8b';

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

type Options = {
  onProcessChange: (
    // eslint-disable-next-line no-unused-vars
    processName: ProcessName,
    // eslint-disable-next-line no-unused-vars
    data: { [key: string]: any },
  ) => void;
};

export default async function prepare(dirPath: string, options?: Options) {
  const { onProcessChange } = getOptions(options);

  try {
    insertGlobalVariableItem('state', {
      id: 'prepare',
    });

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

    await prepareImages(builtMailAppPath, onProcessChange);

    await executeAllTemplates(builtMailAppPath, onProcessChange);

    const warnings = readGlobalVariable('__jsx_mail_warnings');

    cleanAllGlobalVariables();

    return {
      outDir: builtMailAppPath,
      esbuildWarnings,
      warnings,
    };
  } catch (error) {
    console.log(error);
    handleErrors(error);
  }
}

async function prepareImages(
  builtMailAppPath: string,
  onProcessChange: Options['onProcessChange'],
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

  for (const image of images) {
    if (!['pending_upload', 'error'].includes(image.status)) {
      continue;
    }

    try {
      const imageInfo = await imgbbUploadImage(image, onProcessChange, images);

      image.url = imageInfo.data.url;
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

    const imageIndex = images.findIndex((i) => i.hash === image.hash);
    images[imageIndex] = image;
  }

  storage.setItem('images', JSON.stringify(images));
}

async function imgbbUploadImage(
  imagesToUpload: ImageInfo,
  onProcessChange: Options['onProcessChange'],
  allImages: ImageInfo[],
) {
  onProcessChange('uploading_image', {
    ...imagesToUpload,
    images: allImages,
  });

  const imageContent = readImage(imagesToUpload.path);

  const formData = new NodeFormData();
  formData.append('image', bufferToBase64(imageContent));

  const response = await axios.post(
    'https://api.imgbb.com/1/upload',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
      },
      params: {
        key: JSX_MAIL_IMGBB_API_KEY,
        name: imagesToUpload.hash,
      },
    },
  );

  onProcessChange('image_uploaded', {
    ...imagesToUpload,
    images: allImages,
    response: response.data,
  });

  return response.data;
}

async function executeAllTemplates(
  builtMailAppPath: string,
  onProcessChange: Options['onProcessChange'],
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
  onProcessChange: Options['onProcessChange'],
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

function getOptions(options: Options | undefined): {
  onProcessChange: Options['onProcessChange'];
} {
  return (
    options || {
      onProcessChange: () => {
        return;
      },
    }
  );
}

async function copyAllNotCompileFiles(
  dirPath: string,
  outDirFolder: string,
  onProcessChange: Options['onProcessChange'],
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
  onProcessChange: Options['onProcessChange'],
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
  onProcessChange: Options['onProcessChange'],
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
  onProcessChange: Options['onProcessChange'],
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
