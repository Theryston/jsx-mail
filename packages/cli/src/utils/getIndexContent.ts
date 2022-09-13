import { builder } from '../core/builder'
import * as jsxMail from 'jsx-mail'
import * as path from 'path'

export async function getIndexContent(toolbox) {
  await builder(toolbox)

  const absolutePath = jsxMail.getAbsolutePath('')

  const indexDistPath = path.join(absolutePath, 'dist', 'index.js')
  const content = await import(indexDistPath)
  return content.default()
}
