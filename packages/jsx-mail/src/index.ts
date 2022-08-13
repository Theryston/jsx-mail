import { Core } from '@jsx-mail/core';
import { getFileConfig } from './getFileConfig';

export async function render(templateName: string, variables: any) {
  const config = await getFileConfig();

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

  const core = new Core(mailPath, `dist`);

  return await core.render(templateName, variables);
}
