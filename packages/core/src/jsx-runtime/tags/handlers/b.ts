import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const BProps = ['className', 'id', 'style', 'children'];

export default function BHandler(
  props: JSX.IntrinsicElements['b'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'b',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
