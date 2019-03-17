import { IAggregateCommandService, ICommandAdapter } from './interfaces';

/**
 * Container class for administering a command service for an aggregate
 */
class AggregateCommandServiceContainer<T> {

  private _service: IAggregateCommandService<T>;
  private _adapter: ICommandAdapter<T>;

  constructor(service: IAggregateCommandService<T>, adapter: ICommandAdapter<T>) {
    this._service = service;
    this._adapter = adapter;
  }

  public async start(): Promise<void> {
    await Promise.resolve(this._adapter.bind(this._service));
    await this._adapter.start();
  }

}

export default AggregateCommandServiceContainer;
