import { GluegunCommand } from 'gluegun'
import * as server from '../server/index'
import { getFileConfig } from '../utils/getFileConfig'

const command: GluegunCommand = {
  name: 'startServer',
  run: async (toolbox) => {
    const config = await getFileConfig()

    await server.start(toolbox, config)
  },
}

module.exports = command
