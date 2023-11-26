import { JSXMailVirtualDOM } from "..";
import CoreError from "../utils/error";
import getStyle from "./get-style";
import tags from "./tags"

export default function factory(node: JSX.ElementNode, props: any): JSXMailVirtualDOM {
  if (typeof node === 'function') {
    return handleNodeFunction(node, props);
  }

  const tag = getTag(node, props);

  const notSupportedProps = Object.keys(props).filter(prop => !tag.supportedProps.includes(prop))

  if (notSupportedProps.length) {
    throw new CoreError('not_supported_props', {
      tag: node,
      props: notSupportedProps
    });
  }

  const tagResult = tag.handler(props)

  let children
  const newProps = tagResult.props
  const result: any = {
    node
  }

  if (newProps) {
    children = newProps.children
    delete newProps.children
    result.props = newProps
  }

  const style = getStyle(result.props)
  delete result.props.style

  if (style) {
    result.props.style = style
  }

  if (children && !Array.isArray(children)) {
    result.children = [children]
  } else if (children) {
    result.children = children
  } else {
    result.children = []
  }

  result.__jsx_mail_vdom = true

  return result
}

function getTag(node: any, props: any) {
  const tag = tags.find(tag => tag.node === node);

  if (!tag) {
    throw new CoreError('not_supported_tag', {
      node,
      props
    });
  }

  return tag;
}

function handleNodeFunction(node: any, props: any) {
  const result = node(props);

  handlePromiseResult(result);

  return result;
}

function handlePromiseResult(result: any) {
  if (result instanceof Promise) {
    throw new CoreError('promise_not_allowed');
  }
}

