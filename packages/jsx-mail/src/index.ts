import { Core } from '@jsx-mail/core';
import { getFileConfig } from './getFileConfig';
import path from 'path';

export async function render(templateName: string, variables: any) {
  const config = await getFileConfig();

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

  const core = new Core(mailPath, `dist`);

  return await core.render(templateName, variables, config);
}

export function getAbsolutePath(subPath: string) {
  const config = getFileConfig();

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

  return path.join(mailPath, subPath);
}
