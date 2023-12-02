import { prepare } from '../../prepare';
import load from '../../utils/load';

module.exports = {
  command: 'prepare',
  alias: ['p'],
  description: 'Prepare everything for the render',
  run: async () => {
    await prepare();
    load.succeed('Everything is ready');
  },
};
