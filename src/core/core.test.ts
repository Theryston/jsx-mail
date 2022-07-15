import { Core } from '.';

describe('App imports', () => {
  it('should app be defined', () => {
    expect(Core).toBeDefined();
  });

  it('should app be a class', () => {
    let core = new Core('', '');
    expect(core instanceof Core).toBeTruthy();
  });

  it('should build be defined', () => {
    let core = new Core('', '');
    expect(core.build).toBeDefined();
  });

  it('should render be defined', () => {
    let core = new Core('', '');
    expect(core.render).toBeDefined();
  });
});
