import { ExcludeAdminsPipe } from './exclude-admins.pipe';

describe('ExcludeAdminsPipe', () => {
  it('create an instance', () => {
    const pipe = new ExcludeAdminsPipe();
    expect(pipe).toBeTruthy();
  });
});
