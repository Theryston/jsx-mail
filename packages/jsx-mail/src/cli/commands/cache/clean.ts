import core from '@jsx-mail/core';
import load from '../../../utils/load';
import { showError } from '../../../utils/show-error';

module.exports = {
  command: 'clean',
  alias: ['c'],
  description: 'Clean all the local cache',
  run: async () => {
    load.start('Cleaning cache');
    try {
      await core.cleanCache();
      load.succeed('Cache cleaned');
    } catch (error) {
      load.stop();
      showError(error);
    }
  },
};
