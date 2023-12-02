import core from '@jsx-mail/core';
import fs from 'fs';

export default async function render(templateName: string, props?: any) {
  const builtPath = core.getBuiltPath();

  const builtExists = fs.existsSync(builtPath);

  if (!builtExists) {
    throw new Error("Please run 'jsxm prepare' before");
  }

  if (!templateName) {
    throw new Error('Template name is required');
  }

  const result = await core.render({
    builtDirPath: builtPath,
    template: templateName,
    props,
  });

  if (!result) {
    throw new Error('No result');
  }

  return result.code;
}
