/* eslint-disable turbo/no-undeclared-env-vars */
import { showError } from './utils/show-error';
import core from '@jsx-mail/core';
import { getMailAppPath } from './utils/get-mail-app-path';
import { getJsxMailConfig } from './utils/get-config';
import load from './utils/load';
import showCoreError from './utils/show-core-error';
import { JsxMailConfig } from '.';

type ProcessName =
  | 'checking_mail_app_folder'
  | 'checking_compile_files'
  | 'compiling_file'
  | 'copying_file'
  | 'looking_for_images'
  | 'optimizing_image'
  | 'uploading_image'
  | 'running_template';

function onProcessChange(progressName: ProcessName, data: any) {
  const jsxMailGlobal = (global as any).__jsx_mail || {};
  const filesContext = jsxMailGlobal.filesContext || [
    {
      id: data.relativePath || data.path || '/something',
    },
  ];
  const lastFile = filesContext[filesContext.length - 1];
  const path = lastFile.id.split(/[\\/]/).pop();

  switch (progressName) {
    case 'checking_mail_app_folder':
      load.text = 'Checking mail app folder';
      break;
    case 'checking_compile_files':
      load.text = 'Checking compile files';
      break;
    case 'compiling_file':
      load.text = `Compiling ${path}`;
      break;
    case 'copying_file':
      load.text = `Copying ${path}`;
      break;
    case 'looking_for_images':
      load.text = 'Looking for images';
      break;
    case 'optimizing_image':
      load.text = `Optimizing ${path}`;
      break;
    case 'uploading_image':
      load.text = `Uploading ${path}`;
      break;
    case 'running_template':
      load.text = `Running ${path}`;
      break;
  }
}

export async function prepare(ignoreCloud?: boolean) {
  const mailAppPath = getMailAppPath();
  const config = getJsxMailConfig();

  let awsEnvs;
  if (config.storage === 'S3') {
    awsEnvs = verifyS3Envs(config);
  }

  try {
    load.start('Preparing your email...');
    await core.prepare(mailAppPath, {
      onProcessChange,
      ignoreCloud,
      ...config,
      ...awsEnvs,
    });

    load.stop();
  } catch (error: any) {
    load.stop();
    showCoreError(error);
    throw error;
  }
}

function verifyS3Envs(config: JsxMailConfig) {
  const awsAccessKeyId =
    process.env.JSX_MAIL_S3_ACCESS_KEY_ID || config.awsAccessKeyId;
  const awsBucket = process.env.JSX_MAIL_S3_BUCKET || config.awsBucket;
  const awsFolder = process.env.JSX_MAIL_S3_FOLDER || config.awsFolder;
  const awsRegion = process.env.JSX_MAIL_S3_REGION || config.awsRegion;
  const awsSecretAccessKey =
    process.env.JSX_MAIL_S3_SECRET_ACCESS_KEY || config.awsSecretAccessKey;

  if (!awsAccessKeyId || !awsBucket || !awsRegion || !awsSecretAccessKey) {
    showError({
      message: 'You must provide all the S3 envs',
      solution:
        'Add the JSX_MAIL_S3_BUCKET, JSX_MAIL_S3_REGION, JSX_MAIL_S3_ACCESS_KEY_ID, JSX_MAIL_S3_SECRET_ACCESS_KEY envs',
    });
    throw new Error('You must provide all the S3 envs');
  }

  return {
    awsAccessKeyId,
    awsBucket,
    awsFolder,
    awsRegion,
    awsSecretAccessKey,
  };
}
