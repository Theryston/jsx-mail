import { getChildrenFromProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import getStyle from '../../get-style';

export const DivProps = [
  'alignY',
  'alignX',
  'className',
  'id',
  'style',
  'children',
  'container',
  'section',
];

function NormalDivVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;

  return {
    node: 'div',
    props: {
      style,
      ...props,
    },
    children,
    __jsx_mail_vdom: true,
  };
}

function SectionVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;
  delete props.section;

  const align = props.alignX || 'left';
  const valign = props.alignY || 'top';

  return {
    node: 'tr',
    props: {},
    children: [
      {
        node: 'td',
        props: {
          style,
          align,
          valign,
          ...props,
        },
        children,
        __jsx_mail_vdom: true,
      },
    ],
    __jsx_mail_vdom: true,
  };
}

function ContainerVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;
  delete props.container;

  return {
    node: 'table',
    props: {
      width: '100%',
      cellPadding: '0',
      cellSpacing: '0',
      style,
      ...props,
    },
    children,
    __jsx_mail_vdom: true,
  };
}

export default function DivHandler(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  if (props.container) {
    return ContainerVirtualDOM(props);
  } else if (props.section) {
    return SectionVirtualDOM(props);
  } else {
    return NormalDivVirtualDOM(props);
  }
}
