import { cssSecurityList } from './cssSecurityList';

describe('cssSecurityList', () => {
  it('should be defined', () => {
    expect(cssSecurityList).toBeDefined();
  });

  it('should have display property', () => {
    expect(typeof Object.keys(cssSecurityList)[0]).toBe('string');
  });

  it('should have an array of strings in each property', () => {
    Object.keys(cssSecurityList).forEach(key => {
      expect(cssSecurityList[key]).toBeInstanceOf(Array);
      cssSecurityList[key].forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});
