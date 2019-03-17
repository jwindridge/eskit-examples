/* tslint:disable no-var-requires */
require('reflect-metadata');
/* tslint:enable no-var-requires */

import config from 'config';
import { RpcCommandAdapter } from 'eskit/infrastructure/messaging/amqp'

import AggregateCommandServiceContainer from './application/services/AggregateServiceContainer';
import UserCommandService from './application/services/users/UserCommandService';
import UserQueryService from './application/services/users/UserQueryService';

import { IUser } from './domain/model/user';

import setup from './inversify.config';
import log from './util/log';

async function startUserServices() {
  const container = await setup(config);

  const userCommandService = container.resolve(UserCommandService);
  const userQueryService = container.resolve(UserQueryService);

  const url: string = config.get('amqp.url');
  const rpcCommandAdapter = new RpcCommandAdapter({ url });

  log.info('Starting user command service', { service: userCommandService });

  const userCommandContainer = new AggregateCommandServiceContainer<IUser>(userCommandService, rpcCommandAdapter);
  userCommandContainer.start();

  log.info('Starting user query service', { service: userQueryService });
}

startUserServices();
