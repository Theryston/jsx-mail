import { GluegunCommand } from 'gluegun'
import * as server from '../server/index'

const command: GluegunCommand = {
  name: 'startServer',
  run: async (toolbox) => {
    await server.start(toolbox)
  },
}

module.exports = command
