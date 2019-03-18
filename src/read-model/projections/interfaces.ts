import { IApplicationEvent } from 'eskit/application';

export type IComparisonType =
  | '$greaterThan'
  | '$greaterThanOrEqualTo'
  | '$lessThan'
  | '$lessThanOrEqualTo'
  | '$notEqualTo';

export type IComparison = { [field in IComparisonType]: any };

export interface IAndOperator {
  $and?: IQuery[];
}

export interface IOrOperator {
  $or?: IQuery[];
}

export interface IQueryParams {
  [others: string]: number | string | IComparison;
}

export type IQuery = IQueryParams | IAndOperator | IOrOperator;

export interface IUpdateCommand<T> {
  where: IQueryParams;
  set: Partial<T>;
}

export interface IAddCommand<T> {
  orDiscard(): IAddCommand<T>;
  orUpdate(params: IUpdateCommand<T>): IAddCommand<T>;
}

export interface IRemoveCommand {
  where: IQueryParams;
}

export interface IProjectionStore<T> {
  findAll(params?: IQueryParams): Promise<T[]>;
  findOne(params: IQueryParams): Promise<T | null>;

  add(entry: T): IAddCommand<T>;
  update(params: IUpdateCommand<T>): Promise<void>;
  remove(params: IRemoveCommand): Promise<void>;
}

export interface IListProjectionDefinition<T> {
  name: string;

  initialState: T;

  eventHandlers: {
    [s: string]: (
      state: IProjectionStore<T>,
      event: IApplicationEvent
    ) => Promise<void>;
  };
}
