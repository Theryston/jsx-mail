import { JSXMailVirtualDOM } from "..";
import CoreError from "../utils/error";
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

  return tag.handler(props)
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

