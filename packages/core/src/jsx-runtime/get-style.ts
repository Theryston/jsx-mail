import camelToDash from '../utils/camel-to-dash';
import CoreError from '../utils/error';

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
  display: ['block', 'inline-block', 'inline'],
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
  [key: string]: any;
  style?: JSX.ElementStyle;
}) {
  if (!props || !props.style || !Object.keys(props.style).length) {
    return;
  }

  let resultStyles = '';
  for (const style of Object.entries(props.style)) {
    resultStyles = handleStyle(style, resultStyles);
  }

  return resultStyles;
}
function handleStyle(style: [string, string], resultStyles: string) {
  const [key, value] = style;

  const stylesListKeys = Object.keys(CSS_LIST);

  const styleKeyFromCssList = stylesListKeys.find(
    (sKey) => sKey === key,
  ) as keyof CSSList;

  if (!styleKeyFromCssList) {
    throw new CoreError('not_supported_style', {
      key,
    });
  }

  const styleFromCssList = CSS_LIST[styleKeyFromCssList];

  checkStyleValue(styleFromCssList, value, key);

  const dashKey = camelToDash(key);

  resultStyles += `${dashKey}:${value};`;
  return resultStyles;
}

function checkStyleValue(
  styleFromCssList: string[],
  value: string,
  key: string,
) {
  if (styleFromCssList[0] !== '*') {
    if (!styleFromCssList.includes(value)) {
      throw new CoreError('not_supported_style_value', {
        key,
        value,
        validValues: styleFromCssList,
      });
    }
  }
}