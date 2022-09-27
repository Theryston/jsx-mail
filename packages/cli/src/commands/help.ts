import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'help',
  run: async (toolbox) => {
    const { print } = toolbox

    print.warning('Read the docs at https://jsx-mail.org\n')
    print.info('Run: `jsxm version` for see the version')
    print.info('Run: `jsxm serve` for start a mail client')
    print.info('Run: `jsxm build` for build your mail app')
  },
}

module.exports = command
