import { injectable } from 'inversify';

import { IUserDescriptor } from './interfaces';

@injectable()
class UserQueryService {
  public async getUserByUsername(
    username: string
  ): Promise<IUserDescriptor | null> {
    return Promise.resolve(null);
  }

  public async getActiveUsers() {}

  public async authenticateuser() {}
}

export default UserQueryService;
