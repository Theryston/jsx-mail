/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-redeclare
declare namespace JSX {
  type ImportedImage = {
    __jsx_mail_image: boolean;
    path: string;
  };

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
    backgroundColor?: string;
    border?: string;
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
    borderWidth?: string;
    margin?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    color?: string;
    display?: 'block' | 'inline-block' | 'inline';
    font?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    letterSpacing?: string;
    lineHeight?: string;
    listStyleType?: string;
    padding?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    textAlign?: string;
    textDecoration?: string;
    textIndent?: string;
    textTransform?: string;
    verticalAlign?: string;
    width?: string;
    height?: string;
  };

  interface IntrinsicElements {
    html: {
      children?: ElementChildren;
      lang?: string;
    };
    head: {
      children?: ElementChildren;
    };
    body: {
      children?: ElementChildren;
      style?: ElementStyle;
    };
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
    title: {
      children: string;
    };
    link: {
      rel?: string;
      href?: string;
      crossOrigin?: string | boolean;
    };
    img: {
      src: ImportedImage | string;
      alt: string;
      align?: string;
      border?: string;
      height?: string;
      width?: string;
      style?: ElementStyle;
    };
    a: {
      className?: string;
      href: string;
      id?: string;
      style?: ElementStyle;
      target?: string;
      children?: ElementChildren;
    };
    b: {
      className?: string;
      id?: string;
      style?: ElementStyle;
      children: ElementChildren;
    };
    br: {
      className?: string;
      id?: string;
      style?: ElementStyle;
    };
    strong: JSX.IntrinsicElements['b'];
    h: {
      align?: string;
      className?: string;
      id?: string;
      style?: ElementStyle;
      children: ElementChildren;
    };
    h1: JSX.IntrinsicElements['h'];
    h2: JSX.IntrinsicElements['h'];
    h3: JSX.IntrinsicElements['h'];
    h4: JSX.IntrinsicElements['h'];
    h5: JSX.IntrinsicElements['h'];
    h6: JSX.IntrinsicElements['h'];
    hr: {
      align?: string;
      size?: string;
      width?: string;
    };
  }
}

// Declare images
declare module '*.png' {
  const value: JSX.ImportedImage;
  export default value;
}

declare module '*.jpg' {
  // eslint-disable-next-line no-unreachable
  const value: JSX.ImportedImage;
  export default value;
}

declare module '*.jpeg' {
  // eslint-disable-next-line no-unreachable
  const value: JSX.ImportedImage;
  export default value;
}

declare module '*.gif' {
  // eslint-disable-next-line no-unreachable
  const value: JSX.ImportedImage;
  export default value;
}
