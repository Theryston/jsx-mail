import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import path from 'path';
import JSON5 from 'json5';

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
        toolbox.print.error('No package.json file found');
        process.exit(1);
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

        const tsConfig = JSON5.parse(tsConfigString);

        const jsxMailCompilerOptions = {
          types: ['@jsx-mail/core/dist/jsx-runtime/jsx'],
          jsxImportSource: '@jsx-mail/core/dist',
          jsx: 'react-jsx',
        };

        let types;

        if (tsConfig.compilerOptions && tsConfig.compilerOptions.types) {
          types = tsConfig.compilerOptions.types;
        } else {
          types = [];
        }

        types = [...types, ...jsxMailCompilerOptions.types];

        tsConfig.compilerOptions = {
          ...tsConfig.compilerOptions,
          ...jsxMailCompilerOptions,
          types,
        };

        toolbox.filesystem.write('tsconfig.json', tsConfig);
      }

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
