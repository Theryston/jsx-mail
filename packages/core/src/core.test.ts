import { Core } from './index';

describe('App imports', () => {
  it('should app be defined', () => {
    expect(Core).toBeDefined();
  });

  it('should app be a class', () => {
    const core = new Core('', '');
    expect(core instanceof Core).toBeTruthy();
  });

  it('should build be defined', () => {
    const core = new Core('', '');
    expect(core.build).toBeDefined();
  });

  it('should render be defined', () => {
    const core = new Core('', '');
    expect(core.render).toBeDefined();
  });
});
