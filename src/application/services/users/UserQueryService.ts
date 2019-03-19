import { IApplicationEvent } from 'eskit/application';
import { inject, injectable } from 'inversify';

import { PROJECTIONS } from '../../../readModel';
import ActiveUsersProjection, {
  IUserDescriptor
} from '../../../readModel/ActiveUsersProjection';

@injectable()
class UserQueryService {
  private _projection: ActiveUsersProjection;

  constructor(
    @inject(PROJECTIONS.ActiveUsers) projection: ActiveUsersProjection
  ) {
    this._projection = projection;
  }

  public async handle(event: IApplicationEvent) {
    this._projection.handleEvent(event);
  }

  public async getUserByUsername(
    username: string
  ): Promise<IUserDescriptor | null> {
    return this._projection.getUserByUsername(username);
  }

  public async getActiveUsers() {}

  public async authenticateuser() {}
}

export default UserQueryService;
