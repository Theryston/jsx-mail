import { Core } from '@jsx-mail/core'
import { getFileConfig } from './utils/getFileConfig'
import { GluegunToolbox } from 'gluegun'

export async function render(toolbox: GluegunToolbox): Promise<string> {
  const { parameters } = toolbox

  const config = await getFileConfig()

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`)

  const core = new Core(mailPath, `dist`)

  const templateName = parameters.argv[3]
  const props = parameters.options

  const htmlResult = await core.render(templateName, props)

  return htmlResult
}
