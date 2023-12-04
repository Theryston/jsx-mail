import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
import { readGlobalVariable } from '../../../utils/global';
import getStyle from '../../get-style';

export const ButtonProps = ['className', 'href', 'id', 'style', 'children'];

export default function ButtonHandler(
  props: JSX.IntrinsicElements['button'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);

  if (props.style && props.style.height) {
    props.style.lineHeight = props.style.height;
  }

  const style = getStyle(props);
  const state = readGlobalVariable('state')[0]?.id;

  const newProps: any = { ...props };

  delete newProps.children;
  delete newProps.style;

  const isInvalidHref =
    !newProps.href ||
    typeof newProps.href !== 'string' ||
    !newProps.href.startsWith('http');

  if (isInvalidHref && state === 'render') {
    throw new CoreError('href_is_required', {
      props: newProps,
    });
  }

  const gotProps = getProps(newProps, style);

  const styleString = gotProps.style ? gotProps.style : '';

  return {
    node: 'a',
    props: {
      ...gotProps,
      target: '_blank',
      style: `text-decoration: none;padding-left: 16px;padding-right: 16px;height: 32px;line-height: 32px;font-size: 14px;color: white;background-color: #0070F0;display: inline-block;${styleString}`,
    },
    children,
    __jsx_mail_vdom: true,
  };
}
