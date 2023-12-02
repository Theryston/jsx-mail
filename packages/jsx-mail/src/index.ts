import './utils/config-env';

export type JsxMailConfig = {
  dir: string;
  storage: 'JSX_MAIL_CLOUD' | 'S3';
};

export async function render() {
  console.log('Rendering your email...');
}
