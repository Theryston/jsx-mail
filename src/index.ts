import { cli } from './cli';
import { Core } from './core';
import { getFileConfig } from './utils/getFileConfig';

export default cli;

export async function render(templateName: string) {
  const config = await getFileConfig();

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

  const core = new Core(mailPath, `${mailPath}/dist`);

  return await core.render(templateName);
}
