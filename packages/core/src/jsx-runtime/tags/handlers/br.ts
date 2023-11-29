import { getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const BrProps = ['className', 'id', 'style'];

export default function BrHandler(
  props: JSX.IntrinsicElements['br'],
): JSXMailVirtualDOM {
  const style = getStyle(props);
  const newProps: any = { ...props };

  delete newProps.style;

  return {
    node: 'br',
    props: getProps(newProps, style),
    children: [],
    __jsx_mail_vdom: true,
  };
}
