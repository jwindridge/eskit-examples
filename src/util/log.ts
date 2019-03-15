import Logger, { createLogger } from 'bunyan';

const log: Logger = createLogger({
  name: 'eskit-examples.identityaccess'
});

export default log;
