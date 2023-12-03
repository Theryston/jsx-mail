import core from '@jsx-mail/core';
import {
  serverFileChanged,
  startServer,
  stopServer,
} from '../../preview/server';
import load from '../../utils/load';
import { getMailAppPath } from '../../utils/get-mail-app-path';
import onFileChange from '../../utils/on-file-change';

module.exports = {
  command: 'preview',
  alias: ['pv'],
  description: 'Start a preview server',
  run: async () => {
    load.start('Starting server...');
    try {
      await startServer();
      load.succeed(`Preview started at http://localhost:3256`);
    } catch (error) {
      load.stop();
      console.error(error);
      throw error;
    }

    const mailAppPath = getMailAppPath();

    let verifyChanges = false;

    setTimeout(() => {
      verifyChanges = true;
    }, 100);

    onFileChange(mailAppPath, async () => {
      if (!verifyChanges) {
        return;
      }

      return await serverFileChanged();
    });
  },
};

let isRunningSignal = false;
process.on('SIGINT', async () => {
  try {
    if (isRunningSignal) {
      return;
    }
    isRunningSignal = true;

    load.start('Stopping server...');
    await stopServer();

    load.text = 'Cleaning cache before exit...';

    await core.cleanCache();

    load.succeed('Preview stopped');

    process.exit(0);
  } catch (error) {
    load.stop();
    console.error(error);
    process.exit(1);
  }
});
