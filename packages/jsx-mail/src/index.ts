import render from './render';
import './utils/config-env';

export type JsxMailConfig = {
  dir: string;
  storage: 'JSX_MAIL_CLOUD' | 'S3';
};

export { render };
