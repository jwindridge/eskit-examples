import { createAggregate, createEvent, IAggregateDefinition } from 'eskit/domain';

import { DOMAIN_SERVICES, IPasswordHashingService } from '../../services';
import { IUser } from './interfaces';

export const definition: IAggregateDefinition<IUser> = {
  commands: {
    async register(entity, command, services) {
      if (entity.exists) {
        return command.reject('User already registered.');
      }

      const { email, password, username } = command.data;

      const passwordService = services!.get<IPasswordHashingService>(DOMAIN_SERVICES.PasswordHashingService);
      const passwordHash = await passwordService.hashPassword(password);

      return createEvent('registered', { username, email, passwordHash })
    }
  },

  eventHandlers: {
    registered(_, { data: { email, passwordHash, username }}) {
      return {
        email,
        passwordHash,
        username
      }
    }
  },

  initialState: {
    email: '',
    passwordHash: '',
    username: ''
  },

  name: 'user'
}

export default createAggregate(definition);
