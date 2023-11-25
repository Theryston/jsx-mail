import getStyle from "../../get-style"

const allowedProps = ['align', 'className', 'id', 'style', 'children']

export default function DivHandler(props: JSX.IntrinsicElements['div']) {
  const style = getStyle(props)

  delete props.style
  return {
    props,
    style,
  }
}