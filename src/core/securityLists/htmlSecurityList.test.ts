import { htmlSecurityList } from './htmlSecurityList';

describe('htmlSecurityList', () => {
  it('should be defined', () => {
    expect(htmlSecurityList).toBeDefined();
  });

  it('should have display prop', () => {
    expect(typeof Object.keys(htmlSecurityList)[0]).toBe('string');
  });

  it('should have an array of strings in each prop', () => {
    Object.keys(htmlSecurityList).forEach(key => {
      expect(htmlSecurityList[key]).toBeInstanceOf(Array);
      htmlSecurityList[key].forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});
