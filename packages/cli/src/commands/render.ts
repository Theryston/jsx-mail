import { GluegunCommand } from 'gluegun'
import { builder } from '../builder'
import { render } from '../render'

const command: GluegunCommand = {
  name: 'render',
  run: async (toolbox) => {
    const { print } = toolbox
    await builder(toolbox)
    const textResult = await render(toolbox)
    print.success('Rendered successfully!')
    print.info('See all result of render:\n')
    print.info(textResult)
  },
}

module.exports = command
