import arg, { Options } from 'arg';

export function parseArgumentsIntoOptions(rawArgs: string[]) {
  const command = rawArgs.slice(2)[0];
  const argv = rawArgs.slice(3);

  const argCommand = {
    startServer: params => {
      return arg(
        {
          '--path': String,
          '--port': String,
        },
        {
          ...params,
        },
      );
    },
    serve: (params: Options) =>
      arg(
        {},
        {
          ...params,
        },
      ),
    build: (params: Options) =>
      arg(
        {},
        {
          ...params,
        },
      ),
  };

  if (!argCommand[command]) {
    throw new Error(`Unknown command ${command}`);
  }

  return {
    command,
    ...argCommand[command](argv),
  };
}
