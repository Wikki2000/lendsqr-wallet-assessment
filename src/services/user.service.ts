import { BaseModel } from '../models/BaseModel';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../models/types/User';

// Create an instance of BaseModel for the 'users' table
const userModel = new BaseModel<User>('users');

export async function createUser(data: Partial<User>): Promise<string> {
  try {
    if (!data.id) data.id = uuidv4();
    await userModel.add(data);
    return data.id;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('User already exists');
    }
    throw error;
  }
}

