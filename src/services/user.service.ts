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
  function generateAccountNumber(): string {
    const randomPart = Math.floor(10000000 + Math.random() * 90000000);
    return '100' + randomPart.toString();
  }


  try {
    if (!data.id) {
      data.id = uuidv4();
    }
    if (!data.password) {
      throw new Error('Password is required');
    }
    data.password = await hashPassword(data.password);
    await userModel.add(data);

    let accountNumber: string;
    let exists: boolean;

    // Ensure no user get same account number.
    do {
      accountNumber = generateAccountNumber();
      exists = await walletModel.getBy({ accountNumber });
    } while (exists);

    // Create user wallet.
    await walletModel.add({
      id: uuidv4(),
      userId: data.id,
      accountNumber
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
