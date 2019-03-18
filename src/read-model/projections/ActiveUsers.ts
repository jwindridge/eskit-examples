import { IApplicationEvent } from 'eskit/application';
import { IListProjectionDefinition } from './interfaces';
import ListProjection from './ListProjection';

export interface IUserDescriptor {
  email: string;
  username: string;
  version: number;
}

const definition: IListProjectionDefinition<IUserDescriptor> = {
  eventHandlers: {
    'user.registered': async (
      collection,
      { data: { email, username }, version }: IApplicationEvent
    ) => {
      await collection.add({ email, username, version });
    }
  },
  initialState: {
    email: '',
    username: '',
    version: 0
  },

  name: 'activeUsers'
};

const projection = new ListProjection(definition);
export default projection;
