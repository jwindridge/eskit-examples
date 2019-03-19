import 'reflect-metadata';

import aTest, { TestInterface } from 'ava';
import { pseudoRandomBytes } from 'crypto';

import { IPasswordHashingService } from '../../../domain/services';
import BcryptPasswordHashingService from '../BcryptPasswordHashingService';

export type IPasswordHashingTest = TestInterface<{
  passwordHashingService: IPasswordHashingService;
  plaintext: string;
}>;

export const test = aTest as IPasswordHashingTest;

test.beforeEach(async t => {
  const plaintext = (await pseudoRandomBytes(12)).toString('base64');

  // Override the number of salt rounds for faster tests
  const passwordHashingService = new BcryptPasswordHashingService({
    saltRounds: 1
  });

  t.context = {
    ...t.context,
    passwordHashingService,
    plaintext
  };
});
