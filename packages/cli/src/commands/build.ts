import { GluegunCommand } from 'gluegun'
import { builder } from '../builder'

const command: GluegunCommand = {
  name: 'build',
  run: async (toolbox) => {
    await builder(toolbox)
  },
}

module.exports = command
