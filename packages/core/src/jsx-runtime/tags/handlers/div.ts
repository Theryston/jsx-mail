import { getChildrenFromProps } from ".."
import { JSXMailVirtualDOM } from "../../.."
import getStyle from "../../get-style"

export const DivProps = ['align', 'className', 'id', 'style', 'children']

export default function DivHandler(props: JSX.IntrinsicElements['div']): JSXMailVirtualDOM {
  const children = getChildrenFromProps(props)
  const style = getStyle(props)

  delete props.children
  delete props.style

  return {
    node: 'table',
    props: {
      width: '100%',
      border: '0',
      cellSpacing: '0',
      cellPadding: '0',
      style,
      ...props,
    },
    children: [
      {
        node: 'tr',
        props: {},
        children: [
          {
            node: 'td',
            props: {
              align: props.align ? props.align : 'left'
            },
            children,
            __jsx_mail_vdom: true
          }
        ],
        __jsx_mail_vdom: true
      }
    ],
    __jsx_mail_vdom: true
  }
}