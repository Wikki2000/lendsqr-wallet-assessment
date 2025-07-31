import { hashPassword, checkPassword } from '../../utils/password.utils';

describe('Password Utilities', () => {
  const plainPassword = 'superSecure123';

  it('should hash a password and verify it correctly', async () => {
    const hashed = await hashPassword(plainPassword);

    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(plainPassword);

    const isMatch = await checkPassword(plainPassword, hashed);
    expect(isMatch).toBe(true);
  });

  it('should fail verification for incorrect password', async () => {
    const hashed = await hashPassword(plainPassword);

    const isMatch = await checkPassword('wrongPassword', hashed);
    expect(isMatch).toBe(false);
  });
});

