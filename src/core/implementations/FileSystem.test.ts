import { FileSystem } from './FileSystem';
import path from 'path';

describe('FileSystem', () => {
  let fileSystem: FileSystem;

  beforeEach(() => {
    fileSystem = new FileSystem();
  });

  it('should return a directory tree', async () => {
    const directoryTree = await fileSystem.getDirectoryTree(
      path.resolve(__dirname),
    );
    expect(directoryTree).toBeDefined();
    expect(directoryTree.length).toBeGreaterThan(0);
    expect(
      directoryTree.find(f => f.absolutePath.includes('FileSystem.ts')),
    ).toBeDefined();
  });
});
