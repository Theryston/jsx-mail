import { JsxTransform } from './index';
import { IDirectoryTree, IFileSystem } from '../FileSystem/IFileSystem';
import path from 'path';

let fileSystem: IFileSystem;

const jsxMock = `
import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div\`
background-color: red;
\`;

export function testComponent() {
  return <Container>test</Container>;
}
`;

describe('JsxTransform', () => {
  beforeEach(() => {
    fileSystem = {
      importFile: jest.fn(),
      rm: jest.fn(),
      exists: jest.fn(() => Promise.resolve(true)),
      getAllDirectoryTree: jest.fn(
        async (path: string): Promise<IDirectoryTree[]> => {
          if (path === '') {
            return [
              {
                children: [
                  {
                    children: [],
                    path: 'main.ts',
                    type: 'file',
                  },
                ],
                path: 'src',
                type: 'directory',
              },
              {
                children: [],
                path: 'index.tsx',
                type: 'file',
              },
            ];
          }

          return [
            {
              children: [],
              path: 'main.ts',
              type: 'file',
            },
          ];
        },
      ),
      writeFile: jest.fn(
        async (_path: string, _content: string): Promise<void> => {
          return;
        },
      ),
      readUtf8File: jest.fn(async (_path: string): Promise<string> => {
        return jsxMock;
      }),
    };
  });

  describe('jsxTransform.directory', () => {
    it('should call getAllDirectoryTree with correct path', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      await jsxTransform.directory('', '');
      expect(fileSystem.getAllDirectoryTree).toHaveBeenCalledWith('', {
        justFilenameInFilePath: true,
      });
      expect(fileSystem.getAllDirectoryTree).toHaveBeenCalledWith('main.ts', {
        justFilenameInFilePath: true,
      });
    });

    it('should call exists with the correct path', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      await jsxTransform.directory('app', 'dist');
      expect(fileSystem.exists).toHaveBeenCalledWith(path.join('app', 'dist'));
    });

    it('should call rm with the correct path', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      await jsxTransform.directory('app', 'dist');
      expect(fileSystem.rm).toHaveBeenCalledWith(path.join('app', 'dist'));
    });
  });

  describe('jsxTransform.file', () => {
    it('should call readUtf8File with correct path', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      await jsxTransform.file('main.tsx', '');
      expect(fileSystem.readUtf8File).toHaveBeenCalledWith('main.tsx');
    });

    it('should call writeFile with correct path', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      await jsxTransform.file('main.js', 'dist');
      expect(fileSystem.writeFile).toHaveBeenCalledWith(
        path.join('dist', 'main.js'),
        expect.any(String),
      );
    });
  });

  describe('jsxTransform.code', () => {
    it('should transform code', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      const compiledCode = await jsxTransform.code(jsxMock);
      expect(compiledCode).toMatchSnapshot();
    });

    it('should transform code with custom runtime', async () => {
      const jsxTransform = new JsxTransform(fileSystem);
      const compiledCode = await jsxTransform.code(jsxMock, {
        customRuntime: 'customRuntime',
      });
      expect(compiledCode).toMatchSnapshot();
    });
  });
});
