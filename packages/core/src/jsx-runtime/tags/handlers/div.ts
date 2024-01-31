import {
  InjectChildrenPropsOrReplaceDefault,
  getChildrenFromProps,
  getProps,
} from '..';
import { JSXMailVirtualDOM } from '../../..';
import CoreError from '../../../utils/error';
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
  'flex',
];

function handlePropsContainerError(props: JSX.IntrinsicElements['div']) {
  if (props.alignX || props.alignY) {
    throw new CoreError('prop_align_not_supported');
  }

  if (props.section) {
    throw new CoreError('prop_section_not_supported');
  }
}

function handlePropsSectionError(props: JSX.IntrinsicElements['div']) {
  if (props.flex && !props.section) {
    throw new CoreError('prop_flex_not_supported');
  }
}
function handlePropsNormalDivError(props: JSX.IntrinsicElements['div']) {
  handlePropsContainerError(props);
  handlePropsSectionError(props);
}

function NormalDivVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;

  return {
    node: 'div',
    props: getProps(props, style),
    children,
    __jsx_mail_vdom: true,
  };
}

function TdVirtualDOM(
  receivedProps: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const props = { ...receivedProps };
  const children = getChildrenFromProps(props);
  const style = getStyle(props);

  delete props.children;
  delete props.style;
  delete props.section;
  delete props.flex;

  return {
    node: 'td',
    props: {
      ...getProps(props, style),
      align: '__jsx_default_left',
      valign: '__jsx_default_top',
    },
    children,
    __jsx_mail_vdom: true,
  };
}

function SectionVirtualDOM(
  props: JSX.IntrinsicElements['div'],
  ignoreFlexSub?: boolean,
): JSXMailVirtualDOM {
  let flex = props.flex;
  let style = getStyle(props);

  delete props.flex;

  let children = getChildrenFromProps(props);

  if (!ignoreFlexSub && flex) {
    style = '';
    flex = false;
    children = [
      TdVirtualDOM({
        children: [
          ContainerVirtualDOM({
            style: props.style,
            children: [
              SectionVirtualDOM(
                {
                  flex: true,
                  children: children as any,
                },
                true,
              ) as any,
            ],
          }) as any,
        ],
      }),
    ];
  } else if (!flex) {
    children = [
      TdVirtualDOM({
        children: props.children,
      }),
    ];
  } else {
    const propsChildren = Array.isArray(props.children)
      ? props.children
      : props.children
        ? [props.children]
        : [];

    children = propsChildren.map((child) =>
      TdVirtualDOM({
        children: child,
      }),
    );
  }

  const align = props.alignX || '__jsx_default_left';
  const valign = props.alignY || '__jsx_default_top';

  delete props.section;
  delete props.alignX;
  delete props.alignY;
  delete props.children;
  delete props.style;

  children = InjectChildrenPropsOrReplaceDefault(children, 'td', {
    align,
    valign,
  });

  return {
    node: 'tr',
    props: getProps(props, style),
    children,
    __jsx_mail_vdom: true,
  };
}

function ContainerVirtualDOM(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props);
  let width = '0';

  if (props.style?.width) {
    width = props.style.width;
  }

  delete props.style?.width;

  const style = getStyle(props);

  delete props.children;
  delete props.style;
  delete props.container;

  const invalidChildren = children.filter(
    (c: any) => !c.__jsx_mail_vdom || c.node !== 'tr',
  );

  if (invalidChildren.length) {
    throw new CoreError('invalid_container_children', {
      children: invalidChildren.map((c: any) =>
        c.__jsx_mail_vdom ? c.node : c,
      ),
    });
  }

  return {
    node: 'table',
    props: {
      width,
      cellpadding: '0',
      cellspacing: '0',
      ...getProps(props, style),
    },
    children: [
      {
        node: 'tbody',
        props: {},
        children,
        __jsx_mail_vdom: true,
      },
    ],
    __jsx_mail_vdom: true,
  };
}

export default function DivHandler(
  props: JSX.IntrinsicElements['div'],
): JSXMailVirtualDOM {
  if (props.container) {
    handlePropsContainerError(props);
    return ContainerVirtualDOM(props);
  } else if (props.section) {
    handlePropsSectionError(props);
    return SectionVirtualDOM(props);
  } else {
    handlePropsNormalDivError(props);
    return NormalDivVirtualDOM(props);
  }
}
