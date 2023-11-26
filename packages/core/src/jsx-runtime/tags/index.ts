import DivHandler, { DivProps } from "./handlers/div"

export type TagResult = {
  node: string,
  props: any,
}

const tags = [
  {
    node: 'div',
    handler: DivHandler,
    supportedProps: DivProps
  }
]

export default tags