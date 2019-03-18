/* tslint:disable no-var-requires no-submodule-imports */
require('reflect-metadata');
require('module-alias/register');
/* tslint:enable no-var-requires no-submodule-imports */

import config from 'config';
// import RPCUserCommandListener from './port/adapter/RPCUserCommandListener';
import { RpcCommandAdapter } from 'eskit/infrastructure/messaging/amqp';

import { UserCommandService } from './application/services/users';
import setup from './inversify.config';
import log from './util/log';

async function startUserServices() {
  const container = await setup(config);

  log.info('Starting user RPC command service');
  const userCommandService = container.resolve(UserCommandService);
  const commandAdapter = new RpcCommandAdapter(
    config.get('amqp'),
    userCommandService
  );
  commandAdapter.start();
}

startUserServices();
