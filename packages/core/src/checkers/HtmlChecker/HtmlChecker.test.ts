import path from 'path';
import { HtmlChecker } from './index';
import { IFileSystem } from '../../implementations/FileSystem/IFileSystem';
import { IJsxTransform } from '../../implementations/JsxTransform/IJsxTransform';
import { IComponentJsonRender } from '../../implementations/ComponentJsonRender/IComponentJsonRender';
import { IHtmlChecker } from './IHtmlChecker';

let jsxTransform: IJsxTransform;
let fileSystem: IFileSystem;
let componentJsonRender: IComponentJsonRender;
let htmlChecker: IHtmlChecker;

describe('HtmlChecker', () => {
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
    htmlChecker = new HtmlChecker(
      jsxTransform,
      fileSystem,
      componentJsonRender
    );
  });

  describe('htmlChecker.directory', () => {
    it('should call jsxTransform.directory', async () => {
      await htmlChecker.directory('src');
      expect(jsxTransform.directory).toHaveBeenCalledWith('src', 'html-check');
    });

    it('should call fileSystem.importFile', async () => {
      await htmlChecker.directory('src');
      expect(fileSystem.importFile).toHaveBeenCalledWith(
        path.join('src', 'html-check', 'index.js')
      );
    });

    it('should call componentJsonRender.fromComponent with correct params', async () => {
      await htmlChecker.directory('src');
      expect(componentJsonRender.fromComponent).toHaveBeenCalledWith(
        'test-func',
        'test-props'
      );
    });

    it('should call fileSystem.rm with correct params', async () => {
      await htmlChecker.directory('src');
      expect(fileSystem.rm).toHaveBeenCalledWith(
        path.join('src', 'html-check')
      );
    });
  });

  describe('htmlChecker.componentJson', () => {
    it('should get a not allowed tag', async () => {
      const result = await htmlChecker.componentJson({
        type: 'tag-not-allowed',
        props: {},
        children: [],
      });
      expect(result.hasUnexpected).toBe(true);
      expect(result.unexpectedTags[0].tagName).toEqual('tag-not-allowed');
    });

    it('should allow correct tags', async () => {
      const result = await htmlChecker.componentJson({
        type: 'div',
        props: {},
        children: [],
      });
      expect(result.hasUnexpected).toBe(false);
    });

    it('should get a not allowed attribute', async () => {
      const result = await htmlChecker.componentJson({
        type: 'div',
        props: {
          'data-test': 'test',
        },
        children: [],
      });
      expect(result.hasUnexpected).toBe(true);
      expect(result.unexpectedTags[0].tagName).toEqual('div');
      expect(result.unexpectedTags[0].unexpectedProps[0]).toEqual('data-test');
    });

    it('should allow correct attributes', async () => {
      const result = await htmlChecker.componentJson({
        type: 'div',
        props: {
          style: 'background-color: red;',
        },
        children: [],
      });
      expect(result.hasUnexpected).toBe(false);
    });
  });
});
