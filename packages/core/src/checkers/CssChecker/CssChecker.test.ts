import path from 'path';
import { CssChecker } from './index';
import { IFileSystem } from '../../implementations/FileSystem/IFileSystem';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';
import { IComponentJsonRender } from '../../implementations/ComponentJsonRender/IComponentJsonRender';
import { ICssChecker } from './ICssChecker';

let jsxTransform: IJsxTransform;
let fileSystem: IFileSystem;
let componentJsonRender: IComponentJsonRender;
let cssChecker: ICssChecker;

describe('CssChecker', () => {
  beforeAll(() => {
    jsxTransform = {
      directory: jest.fn(),
      file: jest.fn(),
      code: jest.fn(),
    };
    fileSystem = {
      getAllDirectoryTree: jest.fn(),
      writeFile: jest.fn(),
      readUtf8File: jest.fn(),
      exists: jest.fn((_path: string): Promise<boolean> => {
        return Promise.resolve(true);
      }),
      rm: jest.fn(),
      importFile: jest.fn((_path) => {
        return Promise.resolve({
          default: () => {
            return {
              Test: {
                componentFunction: 'test-func',
                props: 'test-props',
              },
            };
          },
        });
      }),
    };
    componentJsonRender = {
      fromComponent: jest.fn(async (_componentFunction, _props) => {
        return {
          type: 'div',
          children: [
            {
              type: 'p',
              props: {},
              children: [
                'test',
                {
                  type: 'span',
                  props: {},
                  children: ['test'],
                },
                'test',
              ],
            },
          ],
          props: {
            style: 'background-color: red;',
          },
        };
      }),
    };
    cssChecker = new CssChecker(jsxTransform, fileSystem, componentJsonRender);
  });

  describe('CssChecker.directory', () => {
    it('should call jsxTransform.directory', async () => {
      await cssChecker.directory('src');
      expect(jsxTransform.directory).toHaveBeenCalledWith('src', 'css-check');
    });

    it('should call fileSystem.importFile', async () => {
      await cssChecker.directory('src');
      expect(fileSystem.importFile).toHaveBeenCalledWith(
        path.join('src', 'css-check', 'index.js')
      );
    });

    it('should call componentJsonRender.fromComponent with correct params', async () => {
      await cssChecker.directory('src');
      expect(componentJsonRender.fromComponent).toHaveBeenCalledWith(
        'test-func',
        'test-props'
      );
    });

    it('should call fileSystem.rm with correct params', async () => {
      await cssChecker.directory('src');
      expect(fileSystem.rm).toHaveBeenCalledWith(path.join('src', 'css-check'));
    });
  });

  describe('cssChecker.componentJson', () => {
    it('should get a not allowed attribute', async () => {
      const result = await cssChecker.componentJson({
        type: 'div',
        props: {},
        children: [],
        styles: [
          {
            key: 'attribute-not-allowed',
            value: '100%',
          },
        ],
      });
      expect(result.hasUnexpected).toBe(true);
      expect(result.unexpectedAttributes[0].attributeName).toEqual(
        'attribute-not-allowed'
      );
    });

    it('should allow correct attributes', async () => {
      const result = await cssChecker.componentJson({
        type: 'div',
        props: {},
        children: [],
        styles: [
          {
            key: 'width',
            value: '100%',
          },
        ],
      });
      expect(result.hasUnexpected).toBe(false);
    });

    it('should get a not allowed values', async () => {
      const result = await cssChecker.componentJson({
        type: 'div',
        props: {},
        children: [],
        styles: [
          {
            key: 'display',
            value: 'not-allowed',
          },
        ],
      });
      expect(result.hasUnexpected).toBe(true);
      expect(result.unexpectedAttributes[0].attributeName).toEqual('display');
      expect(result.unexpectedAttributes[0].unexpectedValues[0]).toEqual(
        'not-allowed'
      );
    });
  });
});
