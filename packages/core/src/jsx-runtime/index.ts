export async function jsx(node: any, props: any) {
  if (typeof node === 'function') {
    return await node(props.children)
  }

  return await props.children
}

export async function jsxs(node: any, props: any) {
  if (typeof node === 'function') {
    return await node(props.children)
  }

  return await props.children
}

export async function Fragment() {
  console.log()
  return ''
}