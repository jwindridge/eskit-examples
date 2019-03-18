import { IApplicationEvent } from 'eskit/application';
import {
  IAddCommand,
  IListProjectionDefinition,
  IProjectionStore
} from './interfaces';

class ListProjection<T> {
  public readonly definition: IListProjectionDefinition<T>;

  constructor(definition: IListProjectionDefinition<T>) {
    this.definition = definition;
  }

  /**
   * Update
   * @param state Current state of an item in the projected list
   * @param event New event pertaining to this projection list item
   */
  public async update(
    collection: IProjectionStore<T>,
    event: IApplicationEvent
  ): Promise<void> {
    const eventType = this._getEventType(event);

    const handleEvent = this.definition.eventHandlers[eventType];

    if (handleEvent) {
      handleEvent(collection, event);
    }
  }

  private _getEventType = (event: IApplicationEvent) =>
    `${event.aggregate.name}.${event.name}`;
}

export default ListProjection;
