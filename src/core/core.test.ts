import { App } from '.';

describe('App imports', () => {
  it('should app be defined', () => {
    expect(App).toBeDefined();
  });

  it('should app be a class', () => {
    let app = new App('', '');
    expect(app instanceof App).toBeTruthy();
  });

  it('should build be defined', () => {
    let app = new App('', '');
    expect(app.build).toBeDefined();
  });
});
