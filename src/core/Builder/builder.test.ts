import { IBuilder } from './IBuilder';
import { Builder } from '.';
import { IJsxTransform } from '../implementations/JsxTransform/IJsxTransform';

let builder: IBuilder;
let jsxTransform: IJsxTransform = {
  directory: jest.fn(),
  file: jest.fn(),
  code: jest.fn(),
};

describe('builder', () => {
  describe('builder.directory', () => {
    it('should call jsxTransform.directory with correct params', async () => {
      builder = new Builder(jsxTransform);
      await builder.directory('src', 'dist');
      expect(jsxTransform.directory).toHaveBeenCalledWith('src', 'dist');
    });
  });
});
