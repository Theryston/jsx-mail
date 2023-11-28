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
    props: {
      ...getProps(props, style),
      style: `margin: 0; padding: 0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;${style}`,
    },
    children,
    __jsx_mail_vdom: true,
  };
}
