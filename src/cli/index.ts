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
    const allowCssNotRecommended = config.allowCssNotRecommended || false;

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

    if (!allowCssNotRecommended) {
      if (buildResult.cssCheckerResult.hasUnexpected) {
        let errorMessage = ``;
        errorMessage += `${chalk.red('CSS not recommended')}\n${chalk.yellow(
          'You have CSS attribute/values that are not recommended by email clients.\n',
        )}`;
        errorMessage += `${chalk.yellow(
          'CSS attribute/values not supported:\n\n',
        )}${chalk.magenta(
          buildResult.cssCheckerResult.unexpectedAttributes
            .map(attribute => {
              return `${attribute.attributeName}: ${
                attribute.unexpectedValues.length > 0
                  ? ` ${attribute.unexpectedValues
                      .map(prop => `${prop}`)
                      .join(' ')}`
                  : ''
              }...;`;
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
