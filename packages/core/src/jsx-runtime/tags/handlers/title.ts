import { JSXMailVirtualDOM } from '../../..';

export const TitleProps = ['children'];

export default function TitleHandler(
  props: JSX.IntrinsicElements['title'],
): JSXMailVirtualDOM {
  return {
    node: 'title',
    props: {},
    children: [props.children],
    __jsx_mail_vdom: true,
  };
}
