import { showError } from './show-error';
import path from 'path';
import fs from 'fs';
import { getJsxMailConfig } from './get-config';

export function getMailAppPath() {
  const config = getJsxMailConfig();

  if (!config.dir) {
    showError({
      message: 'The dir property is required',
      solution: 'Add a dir property to your jsx-mail.config.js file',
    });
    process.exit(1);
  }

  const cwd = process.cwd();
  const mailAppPath = path.resolve(cwd, config.dir);
  const exists = fs.existsSync(mailAppPath);

  if (!exists) {
    showError({
      message: [
        'The dir property must point to a valid directory',
        `The directory ${mailAppPath} does not exist`,
      ],
      solution: 'Create the directory or change the dir property',
    });
    process.exit(1);
  }

  return mailAppPath;
}
