import { FileSystem } from './FileSystem';
import path from 'path';

describe('FileSystem', () => {
  let fileSystem: FileSystem;

  beforeEach(() => {
    fileSystem = new FileSystem();
  });

  it('should be defined', () => {
    expect(fileSystem).toBeDefined();
  });
});
