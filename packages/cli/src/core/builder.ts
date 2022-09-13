import { Core } from '@jsx-mail/core'
import { getFileConfig } from '../utils/getFileConfig'

export async function builder(toolbox) {
  const { print } = toolbox

  const config = await getFileConfig()

  const mailPath = config.mailPath.replace('./', `${process.cwd()}/`)
  const allowHtmlNotRecommended = config.allowHtmlNotRecommended || false
  const allowCssNotRecommended = config.allowCssNotRecommended || false

  const core = new Core(mailPath, `dist`)

  const buildResult = await core.build()

  if (!allowHtmlNotRecommended) {
    if (buildResult.htmlCheckerResult.hasUnexpected) {
      print.warning(`HTML not recommended`)
      print.warning(
        `You have HTML tags/props that are not recommended by email clients.`
      )
      print.warning(`HTML tags/props not supported:`)
      print.info(
        print.colors.magenta(
          buildResult.htmlCheckerResult.unexpectedTags
            .map((tag) => {
              return `<${tag.tagName}${
                tag.unexpectedProps.length > 0
                  ? ` ${tag.unexpectedProps
                      .map((prop) => `${prop}={...}`)
                      .join(' ')}`
                  : ''
              }>...</${tag.tagName}>`
            })
            .join('\n')
        )
      )

      process.exit(1)
    }
  }

  if (!allowCssNotRecommended) {
    if (buildResult.cssCheckerResult.hasUnexpected) {
      print.warning(`CSS not recommended`)
      print.warning(
        `You have CSS attribute/values that are not recommended by email clients.`
      )
      print.warning(`CSS attribute/values not supported:`)
      print.info(
        print.colors.magenta(
          buildResult.cssCheckerResult.unexpectedAttributes
            .map((attribute) => {
              return `${attribute.attributeName}: ${
                attribute.unexpectedValues.length > 0
                  ? ` ${attribute.unexpectedValues
                      .map((prop) => `${prop}`)
                      .join(' ')}`
                  : ''
              }...;`
            })
            .join('\n')
        )
      )

      process.exit(1)
    }
  }
}
