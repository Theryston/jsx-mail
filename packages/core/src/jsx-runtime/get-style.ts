import camelToDash from "../utils/camel-to-dash";
import CoreError from "../utils/error";

export const CSS_LIST = {
  background: ['*'],
  backgroundColor: ['*'],
  border: ['*'],
  margin: ['*'],
  borderBottom: ['*'],
  borderBottomColor: ['*'],
  borderBottomStyle: ['*'],
  borderBottomWidth: ['*'],
  borderColor: ['*'],
  borderLeft: ['*'],
  borderLeftColor: ['*'],
  borderLeftStyle: ['*'],
  borderLeftWidth: ['*'],
  borderRight: ['*'],
  borderRightColor: ['*'],
  borderRightStyle: ['*'],
  borderRightWidth: ['*'],
  borderStyle: ['*'],
  borderTop: ['*'],
  borderTopColor: ['*'],
  borderWidth: ['*'],
  color: ['*'],
  display: [
    'block',
    'flex',
    'inline-block',
    'inline-flex',
    'inline',
    'inline-table',
    'list-item',
    'table',
    'table-caption',
    'table-cell',
    'table-column',
    'table-column-group',
    'table-footer-group',
    'table-header-group',
    'table-row',
    'table-row-group',
  ],
  font: ['*'],
  fontFamily: ['*'],
  fontSize: ['*'],
  fontStyle: ['*'],
  fontVariant: ['*'],
  fontWeight: ['*'],
  height: ['*'],
  letterSpacing: ['*'],
  lineHeight: ['*'],
  listStyleType: ['*'],
  padding: ['*'],
  paddingBottom: ['*'],
  paddingLeft: ['*'],
  paddingRight: ['*'],
  paddingTop: ['*'],
  tableLayout: ['*'],
  textAlign: ['*'],
  textDecoration: ['*'],
  textIndent: ['*'],
  textTransform: ['*'],
  verticalAlign: ['*'],
  width: ['*'],
};

type CSSList = typeof CSS_LIST;

export default function getStyle(props: {
  [key: string]: any,
  style?: JSX.ElementStyle
}) {
  if (!props || !props.style || !Object.keys(props.style).length) {
    return
  }

  let resultStyles = '';
  for (const style of Object.entries(props.style)) {
    const [key, value] = style;

    const stylesListKeys = Object.keys(CSS_LIST)

    const styleKeyFromCssList = stylesListKeys.find(sKey => sKey === key) as keyof CSSList

    if (!styleKeyFromCssList) {
      throw new CoreError('not_supported_style', {
        key
      })
    }

    const styleFromCssList = CSS_LIST[styleKeyFromCssList]

    if (styleFromCssList[0] !== '*') {
      if (!styleFromCssList.includes(value)) {
        throw new CoreError('not_supported_style_value', {
          key,
          value,
          validValues: styleFromCssList
        });
      }
    }

    const dashKey = camelToDash(key)

    resultStyles += `${dashKey}:${value};`
  }

  return resultStyles
}