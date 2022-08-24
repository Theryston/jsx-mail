import * as express from 'express'
import { Core } from '@jsx-mail/core'
import { engine } from 'express-handlebars'
import { builder } from '../builder'

const app = express()
let server: any

export async function start(toolbox, config) {
  const path = toolbox.parameters.argv[4]
  const port = toolbox.parameters.argv[6] || 8080
  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', `${__dirname}/views`)

  const core = new Core(path, `dist`)
  await builder(toolbox)

  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/:templateName', async (req, res) => {
    const templateName = req.params.templateName

    if (templateName.indexOf('.') !== -1) {
      return res.status(400).send('Missing extension')
    }

    toolbox.print.info(`Sending template: ${templateName}`)

    const variables = req.query

    try {
      const htmlCode = await core.render(templateName, variables, config)

      res.render('template', {
        htmlCode,
      })
    } catch (error) {
      res.status(500).send((error as any).message)
    }
  })

  server = app.listen(port)
}

export async function stop() {
  server.close()
}
