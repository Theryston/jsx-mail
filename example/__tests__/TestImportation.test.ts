import { UserController } from '@modules/user/infra/http/controllers/UserController';

describe('UserController', () => {
  it('should import user controllers', () => {
    expect(UserController).toBeDefined();
  });
});
