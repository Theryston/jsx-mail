import fs from 'fs';

export async function getFileConfig() {
  const configFilePath = `${process.cwd()}/jsx-mail.json`;

  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Missing config file at ${configFilePath}`);
  }

  const config = await import(configFilePath);

  if (!config.mailPath) {
    throw new Error('Missing mailPath');
  }

  return config;
}
