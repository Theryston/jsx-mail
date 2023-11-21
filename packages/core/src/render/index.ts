
type renderInputType = {
  templateName: string;
  builtDirPath: string
}

export default function render({ templateName, builtDirPath }: renderInputType): string {
  console.log(JSON.stringify({ templateName, builtDirPath }))
  return '<h1>Hello</h1>'
}