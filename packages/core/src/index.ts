import prepare from "./prepare";
import render from "./render";
import { jsx } from './jsx-runtime'

const core = {
  render,
  prepare,
  jsx
}

export type JSXMailVirtualDOM = {
  node: string,
  props: any,
  children: (JSXMailVirtualDOM | string | number)[]
  __jsx_mail_vdom: boolean
}

export default core