import { getChildrenFromProps, getProps } from '..';
import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
import getStyle from '../../get-style';

export const DivProps = [
  'alignY',
  'alignX',
  'sectionPending',
  'className',
  'id',
  'style',
  'children',
  'container',
  'section',
];

function handleAlignError(props: JSX.IntrinsicElements['div']) {
  if (props.alignX || props.alignY) {
    throw new CoreError('prop_align_not_supported');
  }
}

function handleGapError(props: JSX.IntrinsicElements['div']) {
  if (props.sectionPending) {
    throw new CoreError('prop_gap_not_supported');
  }
}

function NormalDivVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  handleAlignError(props);
  handleGapError(props);

  delete props.children;
  delete props.style;

  return {
    node: 'div',
    props: getProps(props, style),
    children,
    __jsx_mail_vdom: true,
  };
}

function SectionVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  handleGapError(props);

  const align = props.alignX || 'left';
  const valign = props.alignY || 'top';

  delete props.children;
  delete props.style;
  delete props.section;
  delete props.alignX;
  delete props.alignY;

  return {
    node: 'tr',
    props: {},
    children: [
      {
        node: 'td',
        props: {
          ...getProps(props, style),
          align,
          valign,
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
  const cellpadding = props.sectionPending || '0';

  handleAlignError(props);

  delete props.children;
  delete props.style;
  delete props.container;
  delete props.sectionPending;

  return {
    node: 'table',
    props: {
      width: '100%',
      cellpadding,
      cellspacing: '0',
      ...getProps(props, style),
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
