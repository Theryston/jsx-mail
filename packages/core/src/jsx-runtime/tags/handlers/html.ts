import { getChildrenFromProps } from '..';
import { JSXMailVirtualDOM } from '../../..';

export const HtmlProps = ['children', 'lang'];

export default function HtmlHandler(
  props: JSX.IntrinsicElements['html'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);

  delete props.children;

  return {
    node: 'html',
    props: {
      ...props,
      xmlns: 'http://www.w3.org/1999/xhtml',
      'xmlns:v': 'urn:schemas-microsoft-com:vml',
      'xmlns:o': 'urn:schemas-microsoft-com:office:office',
    },
    children,
    __jsx_mail_vdom: true,
  };
}
