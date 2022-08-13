import { exec } from 'child_process';
import { promisify } from 'util';
import { FileSystem } from './index';
import path from 'path';
import fs from 'fs';

let execPromise = promisify(exec);

describe('FileSystem', () => {
  let fileSystem: FileSystem;

  beforeEach(() => {
    fileSystem = new FileSystem();
  });

  describe('fileSystem.getAllDirectoryTree', () => {
    it('should return all directories and files', async () => {
      await execPromise(
        `mkdir ${path.join(__dirname, 'test-fs-get-all-directory-tree')}`
      );
      await execPromise(
        `touch ${path.join(
          __dirname,
          'test-fs-get-all-directory-tree',
          'main.ts'
        )}`
      );
      await execPromise(
        `touch ${path.join(
          __dirname,
          'test-fs-get-all-directory-tree',
          'index.tsx'
        )}`
      );
      const result = await fileSystem.getAllDirectoryTree(
        path.join(__dirname, 'test-fs-get-all-directory-tree')
      );
      expect(result).toMatchSnapshot();
      await execPromise(
        `rm -rf ${path.join(__dirname, 'test-fs-get-all-directory-tree')}`
      );
    });
  });

  describe('fileSystem.writeFile', () => {
    it('should write file', async () => {
      await fileSystem.writeFile(
        path.join(__dirname, 'test-fs-write-file.txt'),
        'test'
      );
      const result = fs.readFileSync(
        path.join(__dirname, 'test-fs-write-file.txt'),
        'utf8'
      );
      expect(result).toBe('test');
      await execPromise(`rm ${path.join(__dirname, 'test-fs-write-file.txt')}`);
    });
  });

  describe('fileSystem.readUtf8File', () => {
    it('should read file', async () => {
      await execPromise(
        `touch ${path.join(__dirname, 'test-fs-read-utf8-file.txt')}`
      );
      const result = await fileSystem.readUtf8File(
        path.join(__dirname, 'test-fs-read-utf8-file.txt')
      );
      expect(result).toBe('');
      await execPromise(
        `rm ${path.join(__dirname, 'test-fs-read-utf8-file.txt')}`
      );
    });
  });

  describe('fileSystem.exists', () => {
    it('should return true', async () => {
      await execPromise(`touch ${path.join(__dirname, 'test-fs-exists.txt')}`);
      const result = await fileSystem.exists(
        path.join(__dirname, 'test-fs-exists.txt')
      );
      expect(result).toBe(true);
      await execPromise(`rm ${path.join(__dirname, 'test-fs-exists.txt')}`);
    });
  });

  describe('fileSystem.rm', () => {
    it('should remove file', async () => {
      await execPromise(`touch ${path.join(__dirname, 'test-fs-rm.txt')}`);
      await fileSystem.rm(path.join(__dirname, 'test-fs-rm.txt'));
      const result = fs.existsSync(path.join(__dirname, 'test-fs-rm.txt'));
      expect(result).toBe(false);
    });
  });
});
