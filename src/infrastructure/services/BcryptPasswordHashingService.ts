import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

import {IPasswordHashingService } from '../../domain/services'

const DEFAULT_SALT_ROUNDS = 10;

interface IBcryptPasswordHashingSeriveOpts {
  saltRounds?: number;
}

@injectable()
class BcryptPasswordHashingService implements IPasswordHashingService {

  private _saltRounds: number;

  public constructor(opts: IBcryptPasswordHashingSeriveOpts = {}) {
    this._saltRounds = opts.saltRounds || DEFAULT_SALT_ROUNDS;
  }

  public async hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this._saltRounds);
  }

  public async verify(candidate: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(candidate, passwordHash);
  }

}

export default BcryptPasswordHashingService;
