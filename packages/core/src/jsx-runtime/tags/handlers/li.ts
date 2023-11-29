import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const LiProps = ['className', 'dir', 'id', 'style', 'type', 'children'];

export default function LiHandler(
  props: JSX.IntrinsicElements['li'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'li',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
