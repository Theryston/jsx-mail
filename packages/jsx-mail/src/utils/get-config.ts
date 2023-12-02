import { JsxMailConfig } from '..';
import { showError } from './show-error';

export function getJsxMailConfig() {
  const cwd = process.cwd();

  let config: JsxMailConfig | undefined;
  try {
    config = require(`${cwd}/jsx-mail.config.js`);
  } catch (error) {
    // Ignore
  }

  if (!config) {
    showError({
      message: 'jsx-mail.config.js not found',
      solution: 'Create a jsx-mail.config.js file in your project root',
    });
    process.exit(1);
  }

  return config;
}
