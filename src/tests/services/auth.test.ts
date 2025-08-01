import db from '../../db/knex';
import { createUser, authUser } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../../models/types/User';
import { checkPassword,  hashPassword } from '../../utils/password.utils';

describe('AuthUser Service', () => {
  const testPassword = 'StrongP@ssword123';
  const testEmail = 'auth-user@example.com';
  const testUserName = 'authUser';

  beforeAll(async () => {
    await db.migrate.latest();

    // create hashed password and user
    const user: Partial<User> = {
      id: uuidv4(),
      email: testEmail,
      userName: testUserName,
      firstName: 'Auth',
      lastName: 'Tester',
      phone: '08000000000',
      password: testPassword,
    };

    await createUser(user);
  });

  afterAll(async () => {
    await db('users').where({ email: testEmail }).delete();
    await db.destroy();
  });

  test('should authenticate using userName', async () => {
    const result = await authUser({ userName: testUserName, password: testPassword });
    expect(result).toBeTruthy();
  });

  test('should authenticate using email', async () => {
    const result = await authUser({ email: testEmail, password: testPassword });
    expect(result).toBeTruthy();
  });

  test('should fail with wrong password', async () => {
    const result = await authUser({ email: testEmail, password: 'WrongPass123!' });
    expect(result).toBeFalsy();
  });

  test('should fail with unknown user', async () => {
    const result = await authUser({ email: 'unknown@example.com', password: testPassword });
    expect(result).toBeFalsy();
  });
});

