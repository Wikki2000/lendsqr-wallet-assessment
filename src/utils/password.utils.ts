import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain text password with hashed one
 */
export const checkPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};


/**
 * Checks if a password meets basic strength requirements:
 * - Minimum 8 characters
 * - At least one lowercase, one uppercase, one number, and one special character
 *
 * @param password - The password string to validate
 * @returns An error message if invalid, or null if valid
 */
export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return null; // valid password
};

