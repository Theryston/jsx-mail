import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
import { readGlobalVariable } from '../../../utils/global';
import getStyle from '../../get-style';

export const AProps = [
  'className',
  'href',
  'id',
  'style',
  'target',
  'children',
];

export default function AHandler(
  props: JSX.IntrinsicElements['a'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);
  const state = readGlobalVariable('state')[0]?.id;

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  const isInvalidHref =
    !newProps.href ||
    typeof newProps.href !== 'string' ||
    (!newProps.href.startsWith('http') && !newProps.href.startsWith('mailto:'));

  if (isInvalidHref && state === 'render') {
    throw new CoreError('href_is_required', {
      props: newProps,
    });
  }

  return {
    node: 'a',
    props: getProps(newProps, style),
    children,
    __jsx_mail_vdom: true,
  };
}
