import DivHandler, { DivProps } from './handlers/div';

export function getChildrenFromProps(props: any) {
  let children = props.children;

  if (children && !Array.isArray(children)) {
    children = [children];
  } else if (!children) {
    children = [];
  }

  return children;
}

const tags = [
  {
    node: 'div',
    handler: DivHandler,
    supportedProps: DivProps,
  },
];

export default tags;
