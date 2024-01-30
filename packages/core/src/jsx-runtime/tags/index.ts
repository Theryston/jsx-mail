import { ChildrenJSXMailVirtualDOM, JSXMailVirtualDOM } from '../..';
import AHandler, { AProps } from './handlers/a';
import BHandler, { BProps } from './handlers/b';
import BodyHandler, { BodyProps } from './handlers/body';
import BrHandler, { BrProps } from './handlers/br';
import ButtonHandler, { ButtonProps } from './handlers/button';
import DivHandler, { DivProps } from './handlers/div';
import FontHandler, { FontProps } from './handlers/font';
import HHandler, { HProps } from './handlers/h';
import HeadHandler, { HeadProps } from './handlers/head';
import HrHandler, { HrProps } from './handlers/hr';
import HtmlHandler, { HtmlProps } from './handlers/html';
import ImgHandler, { ImgProps } from './handlers/img';
import LiHandler, { LiProps } from './handlers/li';
import LinkHandler, { LinkProps } from './handlers/link';
import OlHandler, { OlProps } from './handlers/ol';
import PHandler, { PProps } from './handlers/p';
import SpanHandler, { SpanProps } from './handlers/span';
import StrongHandler, { StrongProps } from './handlers/strong';
import TitleHandler, { TitleProps } from './handlers/title';
import UlHandler, { UlProps } from './handlers/ul';

export function InjectChildrenPropsOrReplaceDefault(
  children: ChildrenJSXMailVirtualDOM[],
  node: string,
  props: any,
): ChildrenJSXMailVirtualDOM[] {
  const newChildren: ChildrenJSXMailVirtualDOM[] = [];

  for (const child of children) {
    if (typeof child !== 'object') {
      newChildren.push(child);
      continue;
    }

    if (child.node === node) {
      child.props = { ...child.props };

      for (const propKey of Object.keys(props)) {
        const currentValue = child.props[propKey];

        if (!currentValue) {
          child.props[propKey] = props[propKey];
          continue;
        }

        if (
          typeof currentValue === 'string' &&
          currentValue.startsWith('__jsx_default_')
        ) {
          child.props[propKey] = props[propKey];
          continue;
        }
      }
    }

    if (child.children.length) {
      child.children = InjectChildrenPropsOrReplaceDefault(
        child.children,
        node,
        props,
      );
    }

    newChildren.push(child);
  }

  return newChildren;
}

export function getChildrenFromProps(props: any) {
  let children = props.children as ChildrenJSXMailVirtualDOM[];

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
  {
    node: 'li',
    handler: LiHandler,
    supportedProps: LiProps,
  },
  {
    node: 'ol',
    handler: OlHandler,
    supportedProps: OlProps,
  },
  {
    node: 'p',
    handler: PHandler,
    supportedProps: PProps,
  },
  {
    node: 'span',
    handler: SpanHandler,
    supportedProps: SpanProps,
  },
  {
    node: 'ul',
    handler: UlHandler,
    supportedProps: UlProps,
  },
  {
    node: 'button',
    handler: ButtonHandler,
    supportedProps: ButtonProps,
  },
  {
    node: 'font',
    handler: FontHandler,
    supportedProps: FontProps,
  },
];

export default tags;
