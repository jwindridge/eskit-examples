import { IConfig } from 'config';
import { Container } from 'inversify';

async function setup(_: IConfig) {
  const container = new Container();

  return container;
}

export default setup;
