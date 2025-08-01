import { BaseModel } from '../models/BaseModel';
import { hashPassword, checkPassword } from '../utils/password.utils';
import { generateToken }  from '../utils/jwt.utils';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../models/types/User';
import type { Wallet } from '../models/types/Wallet';

// BaseModel instances
const userModel = new BaseModel<User>('users');
const walletModel = new BaseModel<Wallet>('wallets');

export async function createUser(data: Partial<User>): Promise<string> {
  try {
    if (!data.id) {
      data.id = uuidv4();
    }
    if (!data.password) {
      throw new Error('Password is required');
    }
    data.password = await hashPassword(data.password);
    await userModel.add(data);

    // Create user wallet.
    await walletModel.add({
      id: uuidv4(),
      userId: data.id
    });

    return data.id;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('User already exists');
    }
    throw error;
  }
}


export async function loginUser(data: Partial<User>): Promise<string | null> {
  const { password, userName, email } = data;

  if (!password || (!userName && !email)) {
    throw new Error('Username/email and password are required');
  }

  let user: User | undefined;
  if (email) user = await userModel.getBy({ email });
  if (!user && userName) user = await userModel.getBy({ userName });

  if (!user || !(await checkPassword(password, user.password))) {
    return null;
  }

  // Omit password
  const { password: _pw, ...userData } = user;
  return generateToken(userData);
}
