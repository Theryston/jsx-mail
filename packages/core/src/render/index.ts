type renderInputType = {
  templateName: string;
  builtDirPath: string;
};

export default async function render({
  templateName,
  builtDirPath,
}: renderInputType): Promise<string> {
  console.log(JSON.stringify({ templateName, builtDirPath }));
  return '<h1>Hello</h1>';
}
