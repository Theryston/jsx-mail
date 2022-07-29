import { IBuilder } from './IBuilder';
import { Builder } from '.';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';
import { IHtmlChecker } from '../checkers/HtmlChecker/IHtmlChecker';

let builder: IBuilder;
let htmlChecker: IHtmlChecker = {
  directory: jest.fn((_path: string) => {
    return Promise.resolve({
      hasUnexpected: false,
      unexpectedTags: [],
    });
  }),
  reactJson: jest.fn(),
};
let jsxTransform: IJsxTransform = {
  directory: jest.fn(),
  file: jest.fn(),
  code: jest.fn(),
};

describe('builder', () => {
  describe('builder.directory', () => {
    it('should call htmlChecker.directory with correct params', async () => {
      builder = new Builder(htmlChecker, jsxTransform);
      await builder.directory('src', 'dist');
      expect(htmlChecker.directory).toHaveBeenCalledWith('src');
    });

    it('should call jsxTransform.directory with correct params', async () => {
      builder = new Builder(htmlChecker, jsxTransform);
      await builder.directory('src', 'dist');
      expect(jsxTransform.directory).toHaveBeenCalledWith('src', 'dist');
    });
  });
});
