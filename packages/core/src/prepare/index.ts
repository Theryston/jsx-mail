/* eslint-disable no-undef */
import CoreError from '../utils/error';
import esbuild from 'esbuild';
import {
  changePathExt,
  clearModuleFromCache,
  copyFileAndCreateFolder,
  createFileWithFolder,
  createFolder,
  exists,
  getAllFilesByDirectory,
  getAllTemplates,
  getBaseCorePath,
  getBuiltPath,
  getFileUrl,
  getRelativePath,
  getTemplateFolder,
  joinPath,
  readFile,
  readImage,
  transformChildrenFileToPath,
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
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import { writeFileSync } from 'fs';

handleImagesImport();

type CompileFilePath = 'jsx' | 'tsx' | 'js' | 'ts';

const COMPILE_FILES_EXT: CompileFilePath[] = ['jsx', 'tsx', 'js', 'ts'];

type StorageType = {
  [key: string]: (
    // eslint-disable-next-line no-unused-vars
    path: string,
    // eslint-disable-next-line no-unused-vars
    hash: string,
    // eslint-disable-next-line no-unused-vars
    options: AllOptions,
  ) => Promise<string>;
};

type ProcessName =
  | 'checking_mail_app_folder'
  | 'checking_compile_files'
  | 'compiling_file'
  | 'copying_file'
  | 'looking_for_images'
  | 'optimizing_image'
  | 'uploading_image'
  | 'running_template';

type AllOptions = {
  onProcessChange: (
    // eslint-disable-next-line no-unused-vars
    processName: ProcessName,
    // eslint-disable-next-line no-unused-vars
    data: { [key: string]: any },
  ) => void;
  ignoreCloud: boolean;
  storage: 'JSX_MAIL_CLOUD' | 'S3';
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  awsBucket: string;
  awsFolder: string;
};

type Options = Partial<AllOptions>;

export default async function prepare(dirPath: string, options?: Options) {
  const allOptions = getOptions(options);
  const { onProcessChange, ignoreCloud } = allOptions;

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

    await prepareImages(
      builtMailAppPath,
      onProcessChange,
      ignoreCloud,
      allOptions,
    );

    await executeAllTemplates(builtMailAppPath, onProcessChange);

    if (ignoreCloud) {
      forceUploadImages();
    }

    await prepareForFrameworks();

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

async function prepareForFrameworks() {
  const baseCorePath = getBaseCorePath();

  const nextJsPath = joinPath(baseCorePath, '..', '.next');
  const usingNextJs = await exists(nextJsPath);

  if (usingNextJs) {
    await prepareForNextJs(nextJsPath);
    return;
  }
}

async function prepareForNextJs(nextJsPath: string) {
  const nftFilesPath = await getAllFilesByDirectory(nextJsPath, {
    extensions: ['.nft.json'],
  });

  for (const nftFilePath of nftFilesPath) {
    const fileStr = await readFile(nftFilePath.path);
    const fileJson = JSON.parse(fileStr);

    if (!fileJson.files) {
      continue;
    }

    const usingJSXMail = !!fileJson.files.find((f: string) =>
      f.endsWith('jsx-mail/package.json'),
    );

    if (!usingJSXMail) {
      continue;
    }

    const baseCorePath = getBaseCorePath();

    const allCoreFiles = await getAllFilesByDirectory(baseCorePath);

    for (const fileCore of allCoreFiles) {
      const folderPath = path.dirname(nftFilePath.path);
      const relativePath = path
        .relative(folderPath, fileCore.path)
        .replaceAll('\\', '/');
      fileJson.files.push(relativePath);
    }

    writeFileSync(nftFilePath.path, JSON.stringify(fileJson));
  }
}

function handleIgnoreCloud(ignoreCloud: boolean) {
  const storage = getStorage();

  if (!ignoreCloud) {
    return;
  }

  const imagesStr = storage.getItem('images');
  const images = JSON.parse(imagesStr || '[]');
  const newImages = images.map((image: ImageInfo) => ({
    ...image,
    status: 'pending_upload',
  }));

  storage.setItem('images', JSON.stringify(newImages));
}

function forceUploadImages() {
  const storage = getStorage();

  const imagesStr = storage.getItem('images');
  const images = JSON.parse(imagesStr || '[]');

  const newImages = images.map((image: ImageInfo) => ({
    ...image,
    status: 'pending_upload',
  }));

  storage.setItem('images', JSON.stringify(newImages));
}

async function prepareImages(
  builtMailAppPath: string,
  onProcessChange: AllOptions['onProcessChange'],
  ignoreCloud: boolean,
  options: AllOptions,
) {
  insertGlobalVariableItem('onlyTag', {
    id: 'img',
  });

  const storage = getStorage();
  const lastStorage = storage.getItem('image_storage');

  if (lastStorage && lastStorage !== options.storage) {
    forceUploadImages();
  }

  await executeAllTemplates(builtMailAppPath, (processName, data) => {
    if (processName === 'running_template') {
      onProcessChange('looking_for_images', data);
    }
  });

  cleanGlobalVariable('onlyTag');

  const imagesString = storage.getItem('images');
  let images: ImageInfo[] = JSON.parse(imagesString || '[]');
  const changedImages: ImageInfo[] = [];

  for (const image of images) {
    insertGlobalVariableItem('fileContext', {
      id: image.path,
    });

    if (image.status !== 'pending_upload') {
      continue;
    }

    try {
      const newPath = await optimizeImage(image, onProcessChange, images);
      const imageUrl = await uploadImage(
        {
          ...image,
          path: newPath,
        },
        onProcessChange,
        images,
        ignoreCloud,
        options,
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

  const oldImagesStr = storage.getItem('images');
  const oldImages = JSON.parse(oldImagesStr || '[]');
  const newImages = oldImages
    .map((oldImage: ImageInfo) => {
      const newImage = changedImages.find(
        (changedImage) => changedImage.hash === oldImage.hash,
      );

      if (newImage) {
        return newImage;
      }

      return oldImage;
    })
    .filter((i: ImageInfo) => i.status !== 'error');

  storage.setItem('images', JSON.stringify(newImages));
  storage.setItem('image_storage', options.storage);

  const imagesError = images.filter((i) => i.status === 'error');

  if (imagesError.length) {
    const firstImageError = imagesError[0];

    if (firstImageError?.error instanceof CoreError) {
      throw firstImageError.error;
    } else if (firstImageError instanceof CoreError) {
      throw firstImageError;
    } else {
      throw new CoreError('fails_to_prepare_image', firstImageError);
    }
  }
}

async function optimizeImage(
  image: ImageInfo,
  onProcessChange: AllOptions['onProcessChange'],
  allImages: ImageInfo[],
): Promise<string> {
  const imagemin = (await import('imagemin')).default;
  const imageminJpegoptim = (await import('imagemin-jpegoptim')).default;
  const imageminPngquant = (await import('imagemin-pngquant')).default;
  const imageminGiflossy = (await import('imagemin-giflossy')).default;

  const baseCorePath = getBaseCorePath();
  const optimizedFolder = joinPath(baseCorePath, 'optimized-images');
  const existsOptimizedFolder = await exists(optimizedFolder);

  if (!existsOptimizedFolder) {
    await createFolder(optimizedFolder);
  }

  const imageExt = image.path.split('.').pop();
  const optimizedImagePath = joinPath(
    optimizedFolder,
    `${image.hash}.${imageExt}`,
  );
  const existsOptimizedImage = await exists(optimizedImagePath);

  if (existsOptimizedImage) {
    return optimizedImagePath;
  }

  onProcessChange('optimizing_image', {
    ...image,
    images: allImages,
  });

  const plugins = [];

  if (imageExt === 'jpg' || imageExt === 'jpeg') {
    plugins.push(imageminJpegoptim());
  } else if (imageExt === 'png') {
    plugins.push(imageminPngquant());
  } else if (imageExt === 'gif') {
    plugins.push(imageminGiflossy());
  }

  await imagemin([image.path], {
    destination: optimizedImagePath,
    plugins,
  });

  await transformChildrenFileToPath(optimizedImagePath);

  return optimizedImagePath;
}

async function uploadImage(
  imagesToUpload: ImageInfo,
  onProcessChange: AllOptions['onProcessChange'],
  allImages: ImageInfo[],
  ignoreCloud: boolean,
  options: AllOptions,
): Promise<string> {
  if (ignoreCloud) {
    return handleLocalImage(imagesToUpload);
  }

  onProcessChange('uploading_image', {
    ...imagesToUpload,
    images: allImages,
  });

  const storageType: StorageType = {
    JSX_MAIL_CLOUD: cloudUploadImage,
    S3: uploadImageToS3,
  };

  const uploadImage = storageType[options.storage];

  if (!uploadImage) {
    throw new CoreError('invalid_storage_type');
  }

  const url = await uploadImage(
    imagesToUpload.path,
    imagesToUpload.hash,
    options,
  );

  return url;
}

function handleLocalImage(imagesToUpload: ImageInfo): string {
  const imageHost = (global as any).__jsx_mail_image_host;

  if (!imageHost) {
    return imagesToUpload.path;
  }

  const imageExt = imagesToUpload.path.split('.').pop();
  const imageFileName = `${imagesToUpload.hash}.${imageExt}`;

  const url = `${imageHost}/${imageFileName}`;

  return url;
}

async function uploadImageToS3(
  path: string,
  hash: string,
  options: AllOptions,
): Promise<string> {
  if (!options.awsAccessKeyId) {
    throw new CoreError('aws_access_key_id_not_found');
  }

  if (!options.awsSecretAccessKey) {
    throw new CoreError('aws_secret_access_key_not_found');
  }

  if (!options.awsBucket) {
    throw new CoreError('aws_bucket_not_found');
  }

  if (!options.awsRegion) {
    throw new CoreError('aws_region_not_found');
  }

  const s3Client = new S3Client({
    region: options.awsRegion,
    credentials: {
      accessKeyId: options.awsAccessKeyId,
      secretAccessKey: options.awsSecretAccessKey,
    },
  });

  const ext = path.split('.').pop();
  const fileName = `${hash}.${ext}`;

  const fileContent = readImage(path);

  const uploadParams = {
    Bucket: options.awsBucket,
    Key: options.awsFolder ? `${options.awsFolder}/${fileName}` : fileName,
    Body: fileContent,
    ContentType: `image/${ext}`,
    ACL: 'public-read' as 'public-read',
  };

  const command = new PutObjectCommand(uploadParams);

  await s3Client.send(command);

  const url = `https://${options.awsBucket}.s3.${options.awsRegion}.amazonaws.com/${uploadParams.Key}`;

  return url;
}

async function executeAllTemplates(
  builtMailAppPath: string,
  onProcessChange: AllOptions['onProcessChange'],
) {
  const allTemplatesFiles = await getAllTemplates(builtMailAppPath);

  for (const templateFile of allTemplatesFiles) {
    insertGlobalVariableItem('fileContext', {
      id: templateFile.path,
    });

    const templateFileUrl = await getFileUrl(templateFile.path);

    onProcessChange('running_template', {
      ...templateFile,
      templateFileUrl,
    });

    clearModuleFromCache(templateFile.path);
    const templateImport = require(templateFile.path);

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
  const newOptions: AllOptions = {
    onProcessChange: () => {
      return;
    },
    ignoreCloud: false,
    storage: 'JSX_MAIL_CLOUD',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: '',
    awsBucket: '',
    awsFolder: '',
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
    insertGlobalVariableItem('fileContext', {
      id: noCompileFile.path,
    });

    const relativePath = await getRelativePath(dirPath, noCompileFile.path);

    const outPath = await joinPath(outDirFolder, relativePath);

    onProcessChange('copying_file', {
      relativePath,
      path: noCompileFile.path,
      destinationPath: outPath,
    });

    await copyFileAndCreateFolder(noCompileFile.path, outPath);
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
    insertGlobalVariableItem('fileContext', {
      id: compileFile.path,
    });

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
    jsxImportSource: '@jsx-mail/core/dist',
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
  const builtMailAppPath = getBuiltPath();

  const outDirFolderExists = await exists(builtMailAppPath);

  if (!outDirFolderExists) {
    await createFolder(builtMailAppPath);
  }

  return { baseCorePath, builtMailAppPath };
}
