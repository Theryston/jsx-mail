import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
import getStyle from '../../get-style';

export const StylingProps = ['style'];

export default function StylingHandler(
  props: JSX.IntrinsicElements['styling'],
): JSXMailVirtualDOM {
  if (!props.style) {
    throw new CoreError('prop_style_required');
  }

  const selectors = Object.keys(props.style);

  let styleStr = '';

  for (const selector of selectors) {
    const selectorStyle = getStyle({
      style: props.style[selector],
    });

    if (!selectorStyle) {
      continue;
    }

    // like: .my-class { background-color: red; }
    styleStr += `${selector}{${selectorStyle}}`;
  }

  return {
    node: 'style',
    props: {},
    children: [styleStr],
    __jsx_mail_vdom: true,
  };
}
