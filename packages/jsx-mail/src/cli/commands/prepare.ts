import { GluegunToolbox } from 'gluegun';

module.exports = {
  command: 'prepare',
  alias: ['p'],
  description: 'Prepare everything in your email for the render',
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.info('Preparing your email for the render...');
  },
};
