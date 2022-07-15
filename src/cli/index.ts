import { parseArgumentsIntoOptions } from './parseArgumentsIntoOptions';
import { server } from '../server';
import { getFileConfig } from '../utils/getFileConfig';
import { Core } from '../core';

export function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);

  const command = options.command;

  const cli = {
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

      const core = new Core(mailPath, `${mailPath}/dist`);

      await core.build();
    },
  };

  return cli[command](options);
}
