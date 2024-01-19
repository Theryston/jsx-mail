import render from './render';
import send from './send';
import './utils/config-env';

type ProcessName =
  | 'checking_mail_app_folder'
  | 'checking_compile_files'
  | 'compiling_file'
  | 'copying_file'
  | 'looking_for_images'
  | 'optimizing_image'
  | 'uploading_image'
  | 'running_template';

export type JsxMailConfig = {
  dir: string;
  storage?: 'JSX_MAIL_CLOUD' | 'S3';
  onProcessChange?: (
    // eslint-disable-next-line no-unused-vars
    processName: ProcessName,
    // eslint-disable-next-line no-unused-vars
    data: { [key: string]: any },
  ) => void;
  ignoreCloud?: boolean;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  awsBucket?: string;
  awsFolder?: string;
};

export { render, send };
