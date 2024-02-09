import { build } from 'gluegun';
import '../utils/config-env';
import requestLogin from '../request-login';

export async function run(argv: string[]) {
  const command = argv[2];

  if (!['login', 'logout'].includes(command || '')) {
    await requestLogin();
  }

  const cli = build()
    .brand('jsxm')
    .src(__dirname)
    .defaultCommand()
    .help()
    .version()
    .create();

  const toolbox = await cli.run(argv);

  return toolbox;
}
