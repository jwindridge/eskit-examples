/* tslint:disable no-var-requires */
require('reflect-metadata');
/* tslint:enable no-var-requires */

import config from 'config';

import UserCommandService from './application/services/users/UserCommandService';
import UserQueryService from './application/services/users/UserQueryService';

import setup from './inversify.config';
import log from './util/log';

async function startUserServices() {
  const container = await setup(config);

  const userCommandService = container.resolve(UserCommandService);
  const userQueryService = container.resolve(UserQueryService);

  log.info('Starting user command service', { service: userCommandService });
  log.info('Starting user query service', { service: userQueryService });
}

startUserServices();
