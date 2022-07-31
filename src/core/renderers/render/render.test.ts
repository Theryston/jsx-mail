import { IRender } from './IRender';
import { Render } from '.';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

let execPromise = promisify(exec);

let render: IRender;

describe('render', () => {
  beforeEach(async () => {
    await execPromise('cp -r mocks/built-app mocks/test-render');
    render = new Render(
      path.join(__dirname, '..', '..', '..', '..', '/mocks/test-render'),
    );
  });

  afterEach(async () => {
    await execPromise('rm -rf mocks/test-render');
  });

  it('should return html with hello world', async () => {
    const htmlText = await render.run('Welcome', {
      prefix: 'Hello, world!',
    });
    expect(htmlText.includes('Hello, world!')).toBeTruthy();
  });
});
