import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const BodyProps = ['children', 'style'];

export default function BodyHandler(
  props: JSX.IntrinsicElements['body'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;

  return {
    node: 'body',
    props: getProps(props, style),
    children,
    __jsx_mail_vdom: true,
  };
}
