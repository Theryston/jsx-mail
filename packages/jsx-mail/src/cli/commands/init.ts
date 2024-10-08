import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import path from 'path';
import JSON5 from 'json5';
import core from '@jsx-mail/core';

module.exports = {
  command: 'init',
  alias: ['i'],
  description: 'Start using JSX Mail in your project',
  run: async (toolbox: GluegunToolbox) => {
    try {
      const isTypescript = toolbox.filesystem.exists('tsconfig.json');

      load.start('Installing dependencies');
      const packageJsonExists = toolbox.filesystem.exists('package.json');

      if (!packageJsonExists) {
        toolbox.filesystem.write(
          'package.json',
          JSON.stringify({
            name: path.basename(process.cwd()),
            version: '1.0.0',
            main: 'index.js',
            license: 'MIT',
          }),
        );
      }

      const packageJson = toolbox.filesystem.read('package.json', 'json');

      if (
        !packageJson.dependencies ||
        !packageJson.dependencies['@jsx-mail/core']
      ) {
        await toolbox.packageManager.add('@jsx-mail/core', {});
      }

      if (!packageJson.dependencies || !packageJson.dependencies['jsx-mail']) {
        await toolbox.packageManager.add('jsx-mail', {});
      }

      load.succeed('Dependencies installed');

      load.start('Preparing configs');

      if (isTypescript) {
        const tsConfigPath = toolbox.filesystem.path('tsconfig.json');
        const tsConfigString = toolbox.filesystem.read(tsConfigPath);

        if (!tsConfigString) {
          toolbox.print.error('No tsconfig.json file found');
          process.exit(1);
        }

        let tsConfig = JSON5.parse(tsConfigString);

        tsConfig = {
          ...tsConfig,
          exclude: [...(tsConfig.exclude || []), 'mail'],
        };

        toolbox.filesystem.write('tsconfig.json', tsConfig);
      }

      toolbox.filesystem.append(
        '.gitignore',
        `${toolbox.filesystem.exists('.gitignore') ? `\n\n` : ''}${core
          .getBaseCorePath()
          .replace(`${process.cwd()}/`, '')
          .replace(`${process.cwd()}\\`, '')}`,
      );

      await toolbox.template.generate({
        template: 'jsx-mail.config.js.ejs',
        target: 'jsx-mail.config.js',
      });

      load.succeed('Configs prepared');

      load.start('Generating files');

      const mailJsxPath = path.join(__dirname, '..', 'templates', 'mail-jsx');
      const mailTsxPath = path.join(__dirname, '..', 'templates', 'mail-tsx');

      if (isTypescript) {
        await toolbox.filesystem.copyAsync(mailTsxPath, 'mail');
      } else {
        await toolbox.filesystem.copyAsync(mailJsxPath, 'mail');
      }

      load.succeed('Files generated');
    } catch (error) {
      load.fail('Failed to generate project');
      toolbox.print.error(error);
      process.exit(1);
    }
  },
};
