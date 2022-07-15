import { IPrerender } from '../../interfaces/IPrerender';
import { Prerender } from '.';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

let execPromise = promisify(exec);

let prerender: IPrerender;

jest.setTimeout(300000);

describe('prerender', () => {
  beforeEach(async () => {
    await execPromise('cp -r mocks/app mocks/test-prerender');
    prerender = new Prerender(
      path.join(__dirname, '..', '..', '..', '..', 'mocks/test-prerender'),
      path.join(__dirname, '..', '..', '..', '..', 'mocks/test-prerender/dist'),
    );
  });

  afterEach(async () => {
    await execPromise('rm -rf mocks/test-prerender');
  });

  it('should build files to dist', async () => {
    await prerender.run();
    expect(fs.existsSync('mocks/test-prerender/dist/index.js')).toBe(true);
    expect(true).toBeTruthy();
  });
});
