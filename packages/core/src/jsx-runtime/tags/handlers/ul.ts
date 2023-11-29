import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const UlProps = ['className', 'dir', 'id', 'style', 'children'];

export default function UlHandler(
  props: JSX.IntrinsicElements['ul'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'ul',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
