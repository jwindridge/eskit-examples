import { test } from './helpers'

test('encrypt & verify correct password', async t => {
  const { passwordHashingService, plaintext } = t.context;
  const hashed = await passwordHashingService.hashPassword(plaintext);

  t.is(hashed.length, 60);
  t.true(plaintext !== hashed);

  t.true(await passwordHashingService.verify(plaintext, hashed));
})

test('verify incorrect password fails', async t => {
  const { passwordHashingService, plaintext } = t.context;
  const hashed = await passwordHashingService.hashPassword(plaintext);

  t.false(await passwordHashingService.verify('bad_password', hashed))
});

test('same password hashes to different value', async t => {
  const { passwordHashingService, plaintext } = t.context;

  const first = await passwordHashingService.hashPassword(plaintext);
  const second = await passwordHashingService.hashPassword(plaintext);

  t.not(first, second);
});