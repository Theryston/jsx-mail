import fs from 'fs';

export function getFileConfig() {
  const configFilePath = `${process.cwd()}/jsx-mail.json`;

  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Missing config file at ${configFilePath}`);
  }

  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

  if (!config.mailPath) {
    throw new Error(`Missing mailPath in config file at ${configFilePath}`);
  }

  return config;
}
