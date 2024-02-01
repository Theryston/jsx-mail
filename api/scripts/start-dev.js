const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const SRC_PATH = path.join(__dirname, '..', 'src');

let isBuilding = false;
async function build() {
  if (isBuilding) return;
  isBuilding = true;

  try {
    console.log('Starting rebuild');
    await new Promise((resolve, reject) => {
      exec('yarn build', (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });

    console.log('Code was built');
  } finally {
    isBuilding = false;
  }
}

async function startDev() {
  const watcher = chokidar.watch(SRC_PATH);

  watcher.on('change', build);
  watcher.on('add', build);
  watcher.on('unlink', build);

  const child = exec('yarn start:offline');

  process.stdin.pipe(child.stdin);
  child.stdout.on('data', (data) => {
    console.log(typeof data === 'string' ? data.replace('\n', '') : data);
  });
}

startDev();
