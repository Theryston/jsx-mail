import { JSXMailVirtualDOM } from '../../..';
import BHandler, { BProps } from './b';

export const StrongProps = BProps;

export default function StrongHandler(
  props: JSX.IntrinsicElements['strong'],
): JSXMailVirtualDOM {
  return BHandler(props);
}
