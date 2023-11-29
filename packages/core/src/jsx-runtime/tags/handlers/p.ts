import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const PProps = ['className', 'dir', 'id', 'style', 'type', 'children'];

export default function PHandler(
  props: JSX.IntrinsicElements['p'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'p',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
