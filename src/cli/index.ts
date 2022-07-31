import { parseArgumentsIntoOptions } from './parseArgumentsIntoOptions';
import { server } from '../server';
import { getFileConfig } from '../utils/getFileConfig';
import { Core } from '../core';
import chalk from 'chalk';

const log = console.log;

export const cliCommands = {
  server: async options => {
    const port = options['--port'];

    if (!port) {
      throw new Error('Missing port');
    }

    const config = await getFileConfig();

    const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

    await server(mailPath, port);
  },
  build: async () => {
    const config = await getFileConfig();

    const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);
    const allowHtmlNotRecommended = config.allowHtmlNotRecommended || false;

    const core = new Core(mailPath, `dist`);

    const buildResult = await core.build();

    if (!allowHtmlNotRecommended) {
      if (buildResult.htmlCheckerResult.hasUnexpected) {
        let errorMessage = ``;
        errorMessage += `${chalk.red('HTML not recommended')}\n${chalk.yellow(
          'You have HTML tags/props that are not recommended by email clients.\n',
        )}`;
        errorMessage += `${chalk.yellow(
          'HTML tags/props not supported:\n\n',
        )}${chalk.magenta(
          buildResult.htmlCheckerResult.unexpectedTags
            .map(tag => {
              return `<${tag.tagName}${
                tag.unexpectedProps.length > 0
                  ? ` ${tag.unexpectedProps
                      .map(prop => `${prop}={...}`)
                      .join(' ')}`
                  : ''
              }>...</${tag.tagName}>`;
            })
            .join('\n'),
        )}`;
        log(errorMessage);
        process.exit(1);
      }
    }
  },
};

export function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);

  const command = options.command;

  return cliCommands[command](options);
}
