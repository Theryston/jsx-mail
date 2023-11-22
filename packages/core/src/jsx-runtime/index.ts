export function jsx(...rest: any) {
  console.log('jsx', rest)
  return '<h1>ok</h1>'
}

export function jsxs(...rest: any) {
  console.log('jsxs', rest)
  return '<h1>ok</h1>'
}

export function Fragment() {
  return ''
}