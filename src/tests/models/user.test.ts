import db from '../../db/knex';
import type { User } from '../../models/types/User';
import { BaseModel } from '../../models/BaseModel';
import { v4 as uuidv4 } from 'uuid';


const userModal = new BaseModel<User>('users');
describe('UserModel', () => {
  const testEmail = 'jest-test@example.com';

  beforeAll(async () => {
    // Run migrations before tests start
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Clean up test data
    await db('users').where({ email: testEmail }).delete();
    await db.destroy();
  });

  test('should add a new user', async () => {
    // Add user
    const [id] = await userModal.add({
      id: uuidv4(),
      email: testEmail,
      firstName: 'John',
      lastName: 'Doe',
      userName: 'test',
      phone: '1234567890',
      password: "12345aA@",
    });

    expect(typeof id).toBe('number');
  });

  test('should fetch user by parameters', async () => {
    const user = await userModal.getBy({ email: testEmail });
    expect(user).toBeDefined();

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe(testEmail);
  });

  test('should return undefined for non-existing user', async () => {
    const user = await userModal.getBy({ email: 'notfound@example.com' });
    expect(user).toBeUndefined();
  });

});
