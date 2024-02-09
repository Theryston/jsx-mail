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
  } catch (error) {
    console.log('Error while building', error);
  } finally {
    isBuilding = false;
  }
}

async function upDockerCompose() {
  console.log('Starting docker-compose');
  await new Promise((resolve, reject) => {
    exec('docker-compose up -d', (error) => {
      if (error) {
        console.log('Error while starting docker-compose', error);
        reject(error);
      }

      console.log('Docker-compose started');
      resolve();
    });
  });
}

async function prepareAll() {
  console.log('Preparing all');
  await new Promise((resolve, reject) => {
    exec('yarn prepare:all', (error) => {
      if (error) {
        console.log('Error while preparing all', error);
        reject(error);
      }

      console.log('Prepared all');
      resolve();
    });
  });
}

async function reinstallDependence() {
  console.log('Reinstalling dependencies');
  await new Promise((resolve, reject) => {
    exec('rm -rf node_modules && yarn', (error) => {
      if (error) {
        console.log('Error while reinstalling dependencies', error);
        reject(error);
      }

      console.log('Reinstalled dependencies');
      resolve();
    });
  });
}

async function startDev() {
  await upDockerCompose();
  await reinstallDependence();
  await prepareAll();

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
