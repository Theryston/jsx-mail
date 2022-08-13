import { IBuilder } from './IBuilder';
import { Builder } from './index';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';
import { IHtmlChecker } from '../checkers/HtmlChecker/IHtmlChecker';
import { ICssChecker } from '../checkers/CssChecker/ICssChecker';

let builder: IBuilder;
const htmlChecker: IHtmlChecker = {
  directory: jest.fn((_path: string) => {
    return Promise.resolve({
      hasUnexpected: false,
      unexpectedTags: [],
    });
  }),
  componentJson: jest.fn(),
};
const cssChecker: ICssChecker = {
  directory: jest.fn((_path: string) => {
    return Promise.resolve({
      hasUnexpected: false,
      unexpectedAttributes: [],
    });
  }),
  componentJson: jest.fn(),
};
const jsxTransform: IJsxTransform = {
  directory: jest.fn(),
  file: jest.fn(),
  code: jest.fn(),
};

describe('builder', () => {
  describe('builder.directory', () => {
    it('should call htmlChecker.directory with correct params', async () => {
      builder = new Builder(htmlChecker, jsxTransform, cssChecker);
      await builder.directory('src', 'dist');
      expect(htmlChecker.directory).toHaveBeenCalledWith('src');
    });

    it('should call jsxTransform.directory with correct params', async () => {
      builder = new Builder(htmlChecker, jsxTransform, cssChecker);
      await builder.directory('src', 'dist');
      expect(jsxTransform.directory).toHaveBeenCalledWith('src', 'dist');
    });
  });
});
