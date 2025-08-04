import db from '../../db/knex';
import { createUser } from '../../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../../models/types/User';

describe('UserService', () => {
  const testEmail = 'jest-user@example.com';

  beforeAll(async () => {
    //await db.migrate.latest();
  });

  afterAll(async () => {
    await db('users').where({ email: testEmail }).delete();
    await db.destroy();
  });

  test('should create a new user', async () => {
    const user: Partial<User> = {
      id: uuidv4(),
      email: testEmail,
      userName: 'jestUser',
      firstName: 'Jest',
      lastName: 'Tester',
      password: '12345',
      phone: '1234567890',
    };

    const userResponse = await createUser(user);

    expect(userResponse).toHaveProperty('userId');
    expect(userResponse).toHaveProperty('wallet');
    expect(typeof userResponse.userId).toBe('string');
    expect(typeof userResponse.wallet).toBe('object');
    expect(userResponse.wallet).toHaveProperty('accountNumber');
    expect(userResponse.wallet).toHaveProperty('walletId');
  });

  test('should not allow duplicate email', async () => {
    const duplicateUser: Partial<User> = {
      id: uuidv4(),
      email: testEmail,
      userName: 'duplicateUser',
      firstName: 'Jest',
      lastName: 'Tester',
      password: '12345',
      phone: '0987654321',
    };

    await expect(createUser(duplicateUser)).rejects.toThrow('User already exists');
  });
});

