import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
import getStyle from '../../get-style';

export const HProps = ['align', 'className', 'id', 'style', 'children'];

export default function HHandler(
  props: JSX.IntrinsicElements['h'],
  node: string,
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node)) {
    throw new CoreError('invalid_h_tag');
  }

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  return {
    node: node,
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
