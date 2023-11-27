import DivHandler, { DivProps } from './handlers/div';
import StylingHandler, { StylingProps } from './handlers/styling';
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
  return {
    ...props,
    ...(style ? { style } : {}),
    ...(props.className ? { class: props.className } : {}),
  };
}

const tags = [
  {
    node: 'div',
    handler: DivHandler,
    supportedProps: DivProps,
  },
  {
    node: 'styling',
    handler: StylingHandler,
    supportedProps: StylingProps,
  },
  {
    node: 'title',
    handler: TitleHandler,
    supportedProps: TitleProps,
  },
];

export default tags;
