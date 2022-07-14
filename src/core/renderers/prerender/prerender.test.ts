import { Prerender } from '.';
import { IFileSystem } from '../../interfaces/IFileSystem';
import { IPrerender } from '../../interfaces/IPrerender';

let prerender: IPrerender;

const fileSystemMock: IFileSystem = {
  getDirectoryTree: async (path: string) => {
    return [
      {
        absolutePath: '',
        type: 'directory',
        children: [
          {
            absolutePath: '',
            type: 'directory',
            children: [],
          },
        ],
      },
    ];
  },
};

describe('Prerender', () => {
  beforeEach(() => {
    prerender = new Prerender('', '', fileSystemMock);
  });

  it('should be defined', () => {
    expect(prerender).toBeDefined();
  });
});

describe('Prerender.run', () => {
  beforeEach(() => {
    prerender = new Prerender('', '', fileSystemMock);
  });

  it('should return a directory tree of js files', async () => {
    const prerenderTree = await prerender.run();
    expect(prerenderTree).toBeDefined();
    expect(prerenderTree.length).toBeGreaterThan(0);
    expect(
      prerenderTree.find(f => f.absolutePath.includes('.js')),
    ).toBeDefined();
  });
});
