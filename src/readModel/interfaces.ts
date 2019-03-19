import { IApplicationEvent } from 'eskit/application';

export interface IEventHandlerMap {
  [eventType: string]: (event: IApplicationEvent) => Promise<void>;
}
