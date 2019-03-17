import { IApplicationCommand } from 'eskit/application'
import { IAggregate } from 'eskit/domain';

export interface IAggregateCommandService<T> {
  aggregate: IAggregate<T>;
  handle: (command: IApplicationCommand) => Promise<void>;
}

export interface ICommandAdapter<T> {
  bind(service: IAggregateCommandService<T>): void | Promise<void>;
  start(): Promise<void>;
}
