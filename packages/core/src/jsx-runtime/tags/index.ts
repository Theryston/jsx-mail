import AHandler, { AProps } from './handlers/a';
import BHandler, { BProps } from './handlers/b';
import BodyHandler, { BodyProps } from './handlers/body';
import BrHandler, { BrProps } from './handlers/br';
import DivHandler, { DivProps } from './handlers/div';
import HeadHandler, { HeadProps } from './handlers/head';
import HtmlHandler, { HtmlProps } from './handlers/html';
import ImgHandler, { ImgProps } from './handlers/img';
import LinkHandler, { LinkProps } from './handlers/link';
import TitleHandler, { TitleProps } from './handlers/title';

export function getChildrenFromProps(props: any) {
  let children = props.children;

  if (children && !Array.isArray(children)) {
    children = [children];
  } else if (!children) {
    children = [];
  }

  return children;
}

export function getProps(props: any, style: string | undefined) {
  if (props.className) {
    props.class = props.className;
    delete props.className;
  }

  if (props.style) {
    delete props.style;
  }

  if (style) {
    props.style = style;
  }

  return props;
}

const tags = [
  {
    node: 'div',
    handler: DivHandler,
    supportedProps: DivProps,
  },
  {
    node: 'title',
    handler: TitleHandler,
    supportedProps: TitleProps,
  },
  {
    node: 'html',
    handler: HtmlHandler,
    supportedProps: HtmlProps,
  },
  {
    node: 'head',
    handler: HeadHandler,
    supportedProps: HeadProps,
  },
  {
    node: 'body',
    handler: BodyHandler,
    supportedProps: BodyProps,
  },
  {
    node: 'link',
    handler: LinkHandler,
    supportedProps: LinkProps,
  },
  {
    node: 'img',
    handler: ImgHandler,
    supportedProps: ImgProps,
  },
  {
    node: 'a',
    handler: AHandler,
    supportedProps: AProps,
  },
  {
    node: 'b',
    handler: BHandler,
    supportedProps: BProps,
  },
  {
    node: 'br',
    handler: BrHandler,
    supportedProps: BrProps,
  },
];

export default tags;
