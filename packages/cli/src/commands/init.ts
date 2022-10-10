import { GluegunCommand } from 'gluegun'
import * as loading from 'loading-cli'
import * as path from 'path'

const load = loading({
  color: 'yellow',
})

const command: GluegunCommand = {
  name: 'init',
  run: async (toolbox) => {
    const { prompt, filesystem, template } = toolbox

    const { folderName } = await prompt.ask({
      type: 'input',
      name: 'folderName',
      message: 'What is the name of your mail app folder? (eg my-mail-app)',
    })

    const mailPath = path.join(process.cwd(), folderName)

    const { lang } = await prompt.ask({
      type: 'input',
      name: 'lang',
      message: 'What is the language of your templates? (eg en-US)',
    })

    load.start('Making the initial project settings...')
    try {
      const jsonConfig = {
        mailPath: `./${folderName}`,
        lang,
        servePort: 3002,
        allowCssNotRecommended: false,
        allowHtmlNotRecommended: false,
      }

      filesystem.write('jsx-mail.json', jsonConfig)

      if (!filesystem.exists(mailPath)) {
        filesystem.dir(mailPath)
      }

      filesystem.dir(path.join(mailPath, 'templates'))
      template.generate({
        template: 'index.tsx.ejs',
        target: path.join(folderName, 'index.tsx'),
      })
      template.generate({
        template: 'Welcome.tsx.ejs',
        target: path.join(folderName, 'templates', 'Welcome.tsx'),
      })
    } catch (error) {
      load.fail('Error while making the initial project settings')
      throw error
    }

    load.succeed('Initial project settings made successfully!')
  },
}

module.exports = command
