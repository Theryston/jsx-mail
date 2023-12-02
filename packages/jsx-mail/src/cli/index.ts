import { build } from 'gluegun';

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
