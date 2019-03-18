import {
  IAggregateCommandService,
  IApplicationCommand,
  ICommandResult
} from 'eskit/application';
import { createCommand, IServiceRegistry } from 'eskit/domain';
import { IAggregateRepository, TYPES } from 'eskit/infrastructure';

import { inject, injectable, named } from 'inversify';

import { AGGREGATES } from '../../../domain/model';
import { IUser, UserAggregate } from '../../../domain/model/user';
import { DOMAIN_SERVICES } from '../../../domain/services';

@injectable()
class UserApplicationService implements IAggregateCommandService<IUser> {
  public readonly aggregate = UserAggregate;
  private _repository: IAggregateRepository<IUser>;
  private _domainServiceRegistry: IServiceRegistry;

  constructor(
    @inject(TYPES.AggregateRepository)
    @named(AGGREGATES.User)
    repository: IAggregateRepository<IUser>,
    @inject(DOMAIN_SERVICES.Registry) serviceRegistry: IServiceRegistry
  ) {
    this._repository = repository;
    this._domainServiceRegistry = serviceRegistry;
  }

  public async handle(command: IApplicationCommand): Promise<ICommandResult> {
    const {
      aggregate: { id },
      data,
      name,
      reject,
      user
    } = command;

    const domainCommand = createCommand(name, reject, data, user);

    const aggregateId = id || (await this._repository.getNextId());
    const entity = await this._repository.getById(aggregateId);

    let result = null;

    try {
      const events = await this.aggregate.applyCommand(
        entity,
        domainCommand,
        this._domainServiceRegistry
      );
      await this._repository.save(aggregateId, events, entity.version);
      result = {
        success: true,
        value: aggregateId
      };
    } catch (error) {
      result = {
        code: 'DOMAIN_ERROR',
        message: error.message,
        success: false
      };
    }

    return result;
  }
}

export default UserApplicationService;
