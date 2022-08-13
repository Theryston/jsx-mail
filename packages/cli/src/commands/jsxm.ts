import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'jsxm',
  run: async (toolbox) => {
    const { print } = toolbox

    print.success('Thank you for using JSX-MAIL!\n')

    print.info('Run: `jsxm help` for more info')
  },
}

module.exports = command
