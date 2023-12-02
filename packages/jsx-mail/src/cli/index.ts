import { build } from 'gluegun';
import '../utils/config-env';

export async function run(argv: string[]) {
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
