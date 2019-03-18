import { IConfig } from 'config';
import { Container } from 'inversify';

import {
  AggregateRepositoryFactory,
  EventStore,
  storage,
  TYPES
} from 'eskit/infrastructure';

import { APPLICATION_SERVICES } from './application/services';
import { UserCommandService } from './application/services/users';

import { TYPES as APPLICATION_TYPES } from './constants';

import { AGGREGATES, user } from './domain/model';
import { DOMAIN_SERVICES } from './domain/services';

import { BcryptPasswordHashingService } from './infrastructure/services';

async function setupDomainServices(_: IConfig): Promise<Container> {
  const container = new Container({ skipBaseClassChecks: true });

  container
    .bind(DOMAIN_SERVICES.PasswordHashingService)
    .to(BcryptPasswordHashingService);

  return Promise.resolve(container);
}

async function setup(opts: IConfig) {
  const container = new Container({ skipBaseClassChecks: true });

  container.bind(APPLICATION_TYPES.ApplicationConfig).toConstantValue(opts);

  container
    .bind(TYPES.storage.FileStoreConfig)
    .toConstantValue(opts.get('storage.config'));
  container.bind(TYPES.storage.AppendOnlyStore).to(storage.FileStore);
  container.bind(TYPES.EventStore).to(EventStore);

  const repositoryFactory = container.resolve(AggregateRepositoryFactory);

  container
    .bind(TYPES.AggregateRepository)
    .toConstantValue(repositoryFactory.createRepository(user.UserAggregate))
    .whenTargetNamed(AGGREGATES.User);

  container
    .bind(APPLICATION_SERVICES.users.UserCommandService)
    .to(UserCommandService);

  container
    .bind(DOMAIN_SERVICES.Registry)
    .toConstantValue(await setupDomainServices(opts));

  return container;
}

export default setup;
