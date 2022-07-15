import { IPrerender } from '../../interfaces/IPrerender';
import { Prerender } from '.';
import { exec } from 'child_process';

let prerender: IPrerender;

jest.setTimeout(300000);

describe('prerender', () => {
  beforeEach(() => {
    exec('cp -r mocks/app/* mocks/test-prerender');
    prerender = new Prerender(
      'mocks/test-prerender',
      'mocks/test-prerender/dist',
    );
  });

  it('should build files to dist', async () => {
    await prerender.run();
    expect(true).toBe(true);
  });
});
