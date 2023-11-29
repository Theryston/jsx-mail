import { JSXMailVirtualDOM } from '../../..';

export const HrProps = ['align', 'size', 'width'];

export default function HrHandler(
  props: JSX.IntrinsicElements['hr'],
): JSXMailVirtualDOM {
  const newProps: any = { ...props };

  return {
    node: 'hr',
    props: newProps,
    children: [],
    __jsx_mail_vdom: true,
  };
}
