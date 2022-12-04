import { Core } from '@jsx-mail/core'
import { GluegunToolbox } from 'gluegun'
import { getFileConfig } from '../utils/getFileConfig'
import { getIndexContent } from '../utils/getIndexContent'
import * as rimraf from 'rimraf'
import * as fs from 'fs'
import { promisify } from 'util'

const rimrafAsync = promisify(rimraf)

export async function handlebars(toolbox: GluegunToolbox): Promise<void> {
  const config = await getFileConfig()
  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`)

  if (fs.existsSync(`${mailPath}/hbs`)) {
    await rimrafAsync(`${mailPath}/hbs`)
  }

  const templates: {
    [key: string]: {
      componentFunction: any
      props: {
        [key: string]: any
      }
    }
  } = await getIndexContent(toolbox)
  const templatesArray = Object.keys(templates).map((key) => {
    return {
      name: key,
      props: Object.keys(templates[key].props),
    }
  })

  for (const template of templatesArray) {
    const { name, props } = template
    const propsObject = props.reduce((acc, prop) => {
      acc[prop] = `{{${prop}}}`
      return acc
    }, {})

    const core = new Core(mailPath, `dist`)

    const htmlResult = await core.render(name, propsObject)

    fs.mkdirSync(`${mailPath}/hbs`)

    fs.writeFileSync(`${mailPath}/hbs/${name}.hbs`, htmlResult)
  }
}