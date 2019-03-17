import { IApplicationCommand } from 'eskit/application';
import { IServiceRegistry } from 'eskit/domain';
import { IAggregateRepository, TYPES } from 'eskit/infrastructure';

import { inject, injectable, named } from 'inversify';

import { IAggregateCommandService } from "../interfaces";

import { AGGREGATES } from '../../../domain/model';
import { IUser, UserAggregate } from '../../../domain/model/user';
import { DOMAIN_SERVICES } from '../../../domain/services';

@injectable()
class UserApplicationService implements IAggregateCommandService<IUser> {

  public readonly aggregate = UserAggregate
  private _repository: IAggregateRepository<IUser>;
  private _domainServiceRegistry: IServiceRegistry;

  constructor (
    @inject(TYPES.AggregateRepository) @named(AGGREGATES.User) repository: IAggregateRepository<IUser>,
    @inject(DOMAIN_SERVICES.Registry) serviceRegistry: IServiceRegistry
  ) {
    this._repository = repository;
    this._domainServiceRegistry = serviceRegistry;
  }

  public async handle(command: IApplicationCommand) {

    const { aggregate: { id } } = command;

    const entity = await this._repository.getById(command.aggregate.id);
    const events = await this.aggregate.applyCommand(entity, command, this._domainServiceRegistry);
    await this._repository.save(id, events, entity.version);
  }
}

export default UserApplicationService;
