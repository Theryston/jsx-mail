import { GluegunCommand } from 'gluegun'
import { getIndexContent } from '../utils/getIndexContent'
import { serve } from '../core/serve'

const command: GluegunCommand = {
  name: 'serve',
  run: async (toolbox) => {
    console.clear()

    const { prompt } = toolbox

    const indexContent = await getIndexContent(toolbox)

    const templates = Object.keys(indexContent).map((key) => {
      return {
        name: key,
        ...indexContent[key],
      }
    })

    const { template } = await prompt.ask({
      type: 'select',
      name: 'template',
      message: 'Select a template to serve',
      choices: ['All', ...templates.map((t) => t.name)],
    })

    if (template !== 'All') {
      const propsAsks: any = []
      const props = templates.find((t) => t.name === template).props

      for (const prop in props) {
        propsAsks.push({
          type: 'input',
          name: prop,
          message: `Insert ${prop} value`,
        })
      }

      const propsValues = await prompt.ask(propsAsks)

      await serve(toolbox, {
        templateName: template,
        props: propsValues,
        isAll: false,
      })
    } else {
      await serve(toolbox, {
        isAll: true,
        templates,
      })
      console.log('bateu aqui')
    }
  },
}

module.exports = command
