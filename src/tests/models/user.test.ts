import db from '../../db/knex';
import { User } from '../../models/types/User';


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
    const [id] = await User.add({
      email: testEmail,
      firstName: 'John',
      lastName: 'Doe',
      userName: 'test',
      phone: '1234567890',
    });
    console.log(id);

    expect(typeof id).toBe('number');
  });

  test('should fetch user by parameters', async () => {
    const user = await User.getBy({ email: testEmail });
    expect(user).toBeDefined();

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe(testEmail);
  });

  test('should return undefined for non-existing user', async () => {
    const user = await User.getBy({ email: 'notfound@example.com' });
    expect(user).toBeUndefined();
  });

});
