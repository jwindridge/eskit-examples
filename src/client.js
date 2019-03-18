const { AMQPRPCClient } = require('@elastic.io/amqp-rpc');
const amqplib = require('amqplib');
const bunyan = require('bunyan');
const uuid = require('uuid');

const log = bunyan.createLogger({ name: 'iam-client' });

async function main() {
  log.info('Starting client');

  const connection = await amqplib.connect(
    'amqp://guest:guest@localhost:5672/cportal'
  );

  log.info('AMQP connection esablished');

  const requestsQueue = 'user';

  const client = new AMQPRPCClient(connection, { requestsQueue });
  await client.start();

  log.info('Client created');

  const result = await client.sendCommand('register', [
    '66487399-3960-47b4-9f22-29ff6ba9a4d1', // user id
    0, // version
    {
      // data
      username: 'authentik8',
      email: 'test@example.com',
      password: 'hunter1'
    },
    uuid.v4(), // user
    null // command id
  ]);
  log.info({ reply: result });
  process.exit(0);
}

main();
