import chokidar from 'chokidar';

export default function onFileChange(
  folderPath: string,
  // eslint-disable-next-line no-unused-vars
  callback: (filePath: string) => Promise<void>,
) {
  const watcher = chokidar.watch(folderPath);

  watcher.on('change', async (filePath: string) => {
    await callback(filePath);
  });

  watcher.on('add', async (filePath: string) => {
    await callback(filePath);
  });

  watcher.on('unlink', async (filePath: string) => {
    await callback(filePath);
  });
}
