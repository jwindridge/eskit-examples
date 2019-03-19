import { IApplicationEvent } from 'eskit/application';
import { inject, injectable } from 'inversify';
import Knex, { QueryInterface } from 'knex';

import { TYPES } from './constants';
import { IEventHandlerMap } from './interfaces';

export interface IUserDescriptor {
  id: string;
  username: string;
  email: string;
  passwordhash: string;
  version: number;
}

@injectable()
class ActiveUsersProjection {
  public readonly tableName = 'p_active_users';

  public readonly handlers: IEventHandlerMap = {
    'user.deactivated': async ({ aggregate: { id } }: IApplicationEvent) => {
      await this._db.where({ id }).update('active', false);
    },
    'user.registered': async ({
      aggregate: { id },
      data: { email, username, passwordHash },
      version
    }: IApplicationEvent) => {
      const user = { email, id, version, passwordHash, username, active: true };
      await this._db.insert(user);
    }
  };

  private _db: QueryInterface;

  constructor(@inject(TYPES.KnexQueryInterface) knex: Knex) {
    this._db = knex(this.tableName);
  }

  public async getUserByUsername(
    username: string
  ): Promise<IUserDescriptor | null> {
    const data = (await this._db
      .select('*')
      .where({ username })
      .first()
      .then()) as IUserDescriptor | undefined;
    if (data) {
      return data;
    }
    return null;
  }

  public async handleEvent(event: IApplicationEvent) {
    const eventType = this._getEventType(event);
    if (Object.keys(this.handlers).includes(eventType)) {
      await this.handlers[eventType](event);
    }
  }

  private _getEventType = ({
    aggregate: { name: aggregate },
    name: eventType
  }: IApplicationEvent) => `${aggregate}.${eventType}`;
}

export default ActiveUsersProjection;
