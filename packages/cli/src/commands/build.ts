import { GluegunCommand } from 'gluegun'
import { builder } from '../builder'

const command: GluegunCommand = {
  name: 'build',
  run: async (toolbox) => {
    await builder(toolbox)
    console.log('All mail app was built successfully!')
  },
}

module.exports = command
