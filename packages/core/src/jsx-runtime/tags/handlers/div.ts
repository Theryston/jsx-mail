import { TagResult } from ".."

export const DivProps = ['align', 'className', 'id', 'style', 'children']

export default function DivHandler(props: JSX.IntrinsicElements['div']): TagResult {
  return {
    node: 'div',
    props: props,
  }
}