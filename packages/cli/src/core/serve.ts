import { GluegunToolbox } from 'gluegun'
import { getFileConfig } from '../utils/getFileConfig'
import * as nodemon from 'nodemon'
import * as open from 'open'

export async function serve(toolbox: GluegunToolbox, selectedInfo: any) {
  const { print } = toolbox

  const config = await getFileConfig()

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`)

  let url = ''
  if (!selectedInfo.isAll) {
    url = `http://localhost:${config.servePort || 8080}/${
      selectedInfo.templateName
    }${Object.keys(selectedInfo.props).length > 0 ? '?' : ''}${Object.keys(
      selectedInfo.props
    )
      .map((key) => `${key}=${encodeURIComponent(selectedInfo.props[key])}`)
      .join('&')}`

    open(url)
  }

  nodemon(
    `--watch ${mailPath} -e tsx,ts,js,jsx --ignore ${mailPath}/dist/ --ignore ${mailPath}/css-check/ --ignore ${mailPath}/html-check/ --exec "jsxm startServer --path ${mailPath} --port ${
      config.servePort || 8080
    }"`
  )

  nodemon
    .on('start', function () {
      console.clear()
      print.success('Email client started!')
      print.info('It may take a little longer for the server to start')
      if (!selectedInfo.isAll) {
        print.info(`Running template: ${selectedInfo.templateName}`)
        print.info(`Go to: ${print.colors.blue(url)}`)
      } else {
        print.info(`Running all templates`)
        for (const template of selectedInfo.templates) {
          url = `${print.colors.blue(
            `http://localhost:${config.servePort || 8080}/${template.name}${
              Object.keys(template.props).length > 0 ? '?' : ''
            }${Object.keys(template.props)
              .map((key) => `${key}=${encodeURIComponent(template.props[key])}`)
              .join('&')}`
          )}`
          print.info(`Template: ${template.name} - ${url}`)
        }
      }
      print.info('Press CTRL+C to stop the server\n')
    })
    .on('quit', function () {
      print.info('Mail Client Stopped')
      process.exit()
    })
    .on('restart', function (files: any) {
      print.info('Mail Client Restarted due to: ' + files.join(', '))
    })
}
