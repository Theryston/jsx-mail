import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const OlProps = ['className', 'dir', 'id', 'style', 'type', 'children'];

export default function OlHandler(
  props: JSX.IntrinsicElements['ol'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'ol',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
