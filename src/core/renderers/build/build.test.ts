import { IBuild } from '../../interfaces/IBuild';
import { Build } from '.';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

let execPromise = promisify(exec);

let build: IBuild;

jest.setTimeout(300000);

describe('build', () => {
  beforeEach(async () => {
    await execPromise('cp -r mocks/app mocks/test-build');
    build = new Build(
      path.join(__dirname, '..', '..', '..', '..', 'mocks/test-build'),
      path.join(__dirname, '..', '..', '..', '..', 'mocks/test-build/dist'),
    );
  });

  afterEach(async () => {
    await execPromise('rm -rf mocks/test-build');
  });

  it('should build files to dist', async () => {
    await build.run();
    expect(fs.existsSync('mocks/test-build/dist/index.js')).toBe(true);
  });
});
