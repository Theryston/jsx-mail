import { createFolder, exists, getBaseCorePath, joinPath } from "../utils/file-system"

export default async function build(dirPath: string): Promise<string> {
  console.log(dirPath)
  const baseCorePath = await getBaseCorePath()
  const outDirFolder = await joinPath(baseCorePath, 'mail-app-built')
  const outDirFolderExists = await exists(outDirFolder);

  if (!outDirFolderExists) {
    await createFolder(outDirFolder)
  }

  return outDirFolder
}