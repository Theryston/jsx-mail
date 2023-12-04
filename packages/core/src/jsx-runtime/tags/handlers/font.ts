import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';

export const FontProps = ['href'];

export default function FontHandler(
  props: JSX.IntrinsicElements['font'],
): JSXMailVirtualDOM {
  if (!props.href || !props.href.startsWith('http')) {
    throw new CoreError('font_invalid_href');
  }

  return {
    node: 'div',
    props: {},
    children: [
      {
        node: 'link',
        props: {
          rel: 'stylesheet',
          href: props.href,
        },
        children: [],
        __jsx_mail_vdom: true,
      },
      {
        node: 'style',
        props: {
          type: 'text/css',
        },
        children: [`@import url('${props.href}');`],
        __jsx_mail_vdom: true,
      },
    ],
    __jsx_mail_vdom: true,
  };
}
