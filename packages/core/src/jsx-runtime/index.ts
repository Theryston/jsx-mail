import factory from './factory';

export function jsx(node: JSX.ElementNode, props: JSX.ElementProps) {
  return factory(node, props);
}

export function jsxs(node: JSX.ElementNode, props: JSX.ElementProps) {
  return factory(node, props);
}

export const Fragment = 'div';
