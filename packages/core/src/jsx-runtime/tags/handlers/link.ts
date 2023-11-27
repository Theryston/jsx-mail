import { JSXMailVirtualDOM } from '../../..';

export const LinkProps = ['rel', 'href', 'crossOrigin'];

export default function LinkHandler(
  props: JSX.IntrinsicElements['link'],
): JSXMailVirtualDOM {
  const newProps: any = { ...props };

  if (newProps.crossOrigin) {
    newProps.crossorigin = newProps.crossOrigin;
    delete newProps.crossOrigin;
  }

  return {
    node: 'link',
    props: newProps,
    children: [],
    __jsx_mail_vdom: true,
  };
}
