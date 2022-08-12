import { GluegunCommand } from 'gluegun'
import * as nodemon from 'nodemon'
import { getFileConfig } from '../utils/getFileConfig'

const command: GluegunCommand = {
  name: 'serve',
  run: async (toolbox) => {
    const { print } = toolbox

    const config = await getFileConfig()

    const mailPath = config.mailPath.replace('./', `${process.cwd()}/`)

    nodemon(
      `--watch ${mailPath} -e tsx,ts,js,jsx --ignore ${mailPath}/dist/ --ignore ${mailPath}/css-check/ --ignore ${mailPath}/html-check/ --exec "jsxm startServer --path ${mailPath} --port ${
        config.servePort || 8080
      }"`
    )

    nodemon
      .on('start', function () {
        console.clear()

        print.info(
          `Mail Client Started. Open in web browser: ${print.colors.blue(
            `http://localhost:${config.servePort || 8080}`
          )}`
        )
      })
      .on('quit', function () {
        print.info('Mail Client Stopped')
        process.exit()
      })
      .on('restart', function (files: any) {
        print.info('Mail Client Restarted due to: ' + files.join(', '))
      })
  },
}

module.exports = command
