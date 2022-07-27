import { IBuild } from './IBuild';
import { Build } from '.';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { JsxTransform } from '../../implementations/JsxTransform';
import { FileSystem } from '../../implementations/FileSystem';

let execPromise = promisify(exec);

let build: IBuild;
let fileSystem = new FileSystem();
let jsxTransform = new JsxTransform(fileSystem);

jest.setTimeout(300000);

describe('build', () => {
  beforeEach(async () => {
    await execPromise('cp -r mocks/app mocks/test-build');
    build = new Build(jsxTransform);
  });

  afterEach(async () => {
    await execPromise('rm -rf mocks/test-build');
  });

  it('should build files to dist', async () => {
    await build.directory(
      path.resolve(__dirname, '../../../../mocks/test-build'),
      'dist',
    );
    expect(fs.existsSync('mocks/test-build/dist/index.js')).toBe(true);
  });
});
