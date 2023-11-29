import { JSXMailVirtualDOM } from '../..';
import AHandler, { AProps } from './handlers/a';
import BHandler, { BProps } from './handlers/b';
import BodyHandler, { BodyProps } from './handlers/body';
import BrHandler, { BrProps } from './handlers/br';
import DivHandler, { DivProps } from './handlers/div';
import HHandler, { HProps } from './handlers/h';
import HeadHandler, { HeadProps } from './handlers/head';
import HrHandler, { HrProps } from './handlers/hr';
import HtmlHandler, { HtmlProps } from './handlers/html';
import ImgHandler, { ImgProps } from './handlers/img';
import LinkHandler, { LinkProps } from './handlers/link';
import StrongHandler, { StrongProps } from './handlers/strong';
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

type Tag = {
  node: string;
  // eslint-disable-next-line no-unused-vars
  handler: (props: any, node: string) => JSXMailVirtualDOM;
  supportedProps: string[];
};

const tags: Tag[] = [
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
  {
    node: 'strong',
    handler: StrongHandler,
    supportedProps: StrongProps,
  },
  {
    node: 'h1',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'h2',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'h3',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'h4',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'h5',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'h6',
    handler: HHandler,
    supportedProps: HProps,
  },
  {
    node: 'hr',
    handler: HrHandler,
    supportedProps: HrProps,
  },
];

export default tags;
