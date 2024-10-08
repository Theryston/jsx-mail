import { getChildrenFromProps } from '..';
import { JSXMailVirtualDOM } from '../../..';

export const HeadProps = ['children'];

export default function HeadHandler(
  props: JSX.IntrinsicElements['head'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);

  delete props.children;

  return {
    node: 'head',
    props: {},
    children: [
      {
        node: 'meta',
        props: {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge',
        },
        children: [],
        __jsx_mail_vdom: true,
      },
      {
        node: 'meta',
        props: {
          'http-equiv': 'Content-Type',
          content: 'text/html; charset=UTF-8',
        },
        children: [],
        __jsx_mail_vdom: true,
      },
      {
        node: 'meta',
        props: {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        children: [],
        __jsx_mail_vdom: true,
      },
      {
        node: 'style',
        props: {
          type: 'text/css',
        },
        children: [
          `#outlook a {padding: 0;}body{margin: 0;padding: 0;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}`,
        ],
        __jsx_mail_vdom: true,
      },
      ...children,
    ],
    __jsx_mail_vdom: true,
  };
}
