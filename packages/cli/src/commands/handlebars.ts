import { GluegunCommand } from 'gluegun'
import { handlebars } from '../core/handlebars'
import * as loading from 'loading-cli'

const load = loading({
  color: 'yellow',
})

const command: GluegunCommand = {
  name: 'handlebars',
  run: async (toolbox) => {
    load.start('Generating handlebars files...')
    try {
      await handlebars(toolbox)
      load.succeed('Handlebars files generated successfully!')
    } catch (error) {
      load.fail('Error while generating handlebars files')
      throw error
    }
  },
}

module.exports = command
