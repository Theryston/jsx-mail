import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import render from '../../render';
import showCoreError from '../../utils/show-core-error';

module.exports = {
  command: 'render',
  alias: ['r'],
  description: 'Render the template',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox;
    const templateName = parameters.first;
    const outPath = parameters.options['out'];
    const props = parameters.options;

    if (!templateName) {
      load.fail('Template name is required');
      return;
    }

    load.start('Rendering');
    try {
      const html = await render(templateName, props);

      if (!html) {
        load.fail('No result');
        return;
      }

      if (outPath) {
        await toolbox.filesystem.writeAsync(outPath, html);
        load.succeed(`Template saved at ${outPath}`);
        return;
      }

      load.stop();
      toolbox.print.info(html);
    } catch (error) {
      load.stop();
      showCoreError(error);
      return;
    }
  },
};
