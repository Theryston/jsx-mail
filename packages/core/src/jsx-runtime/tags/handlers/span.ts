import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const SpanProps = ['className', 'id', 'style', 'children'];

export default function SpanHandler(
  props: JSX.IntrinsicElements['span'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: 'span',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
