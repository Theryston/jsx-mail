import { parseArgumentsIntoOptions } from './parseArgumentsIntoOptions';
import * as server from '../server';
import { getFileConfig } from '../utils/getFileConfig';
import { Core } from '../core';
import chalk from 'chalk';
import nodemon from 'nodemon';

const log = console.log;

export const cliCommands = {
  startServer: async options => {
    await server.start(options['--path'], options['--port']);
  },
  serve: async () => {
    const config = await getFileConfig();

    const mailPath = config.mailPath.replace('./', `${process.cwd()}/`);

    nodemon(
      `--watch ${mailPath} -e tsx,ts,js,jsx --ignore ${mailPath}/dist/ --ignore ${mailPath}/css-check/ --ignore ${mailPath}/html-check/ --exec "jsxm startServer --path ${mailPath} --port ${
        config.servePort || 8080
      }"`,
    );

    nodemon
      .on('start', function () {
        console.clear();
        console.log(
          chalk.green(`Mail Client Started. Open in web browser:`) +
            chalk.blue(` http://localhost:${config.servePort || 8080}`),
        );
      })
      .on('quit', function () {
        console.log(chalk.green('Mail Client Stopped'));
        process.exit();
      })
      .on('restart', function (files) {
        console.log(
          chalk.green(
            'Mail Client Restarting due to: ' +
              files.join(', ') +
              ' files changed',
          ),
        );
      });
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
