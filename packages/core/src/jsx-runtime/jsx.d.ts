/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-redeclare
declare namespace JSX {
  type ElementChildren =
    | Element
    | string
    | number
    | (Element | string | number)[];

  type ElementProps = {
    children?: ElementChildren;
    className: string;
  };

  type ElementNode = any;

  type Element = {
    type: string;
    props: ElementProps;
  };

  type ElementChildrenAttribute = {
    children: ElementChildren;
  };

  type ElementStyle = {
    background?: string;
    backgroundColor?: string;
    border?: string;
    margin?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderColor?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderStyle?: string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopStyle?: string;
    borderWidth?: string;
    color?: string;
    display?: 'block' | 'inline-block' | 'inline';
    font?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    height?: string;
    letterSpacing?: string;
    lineHeight?: string;
    listStyleType?: string;
    padding?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    tableLayout?: string;
    textAlign?: string;
    textDecoration?: string;
    textIndent?: string;
    textTransform?: string;
    verticalAlign?: string;
    width?: string;
  };

  interface IntrinsicElements {
    div: {
      alignY?: 'top' | 'center' | 'bottom';
      alignX?: 'left' | 'center' | 'right';
      sectionPending?: string;
      className?: string;
      id?: string;
      style?: ElementStyle;
      children?: ElementChildren;
      container?: boolean;
      section?: boolean;
    };
    styling: {
      style: {
        [selector: string]: ElementStyle;
      };
    };
    title: {
      children: string;
    };
  }
}
