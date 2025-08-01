import { BaseModel } from '../models/BaseModel';
import { generateToken } from '../utils/jwt.utils';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../models/types/User';

// Create an instance of BaseModel for the 'users' table
const walletModel = new BaseModel<User>('users');

export const fundWalletService = async (userId: number, amount: number) => {
	  const wallet = await db('wallets').where({ user_id: userId }).first();

	    if (!wallet) throw new Error('Wallet not found');

	      const newBalance = Number(wallet.balance) + Number(amount);

	        await db('wallets').where({ user_id: userId }).update({ balance: newBalance });

		  return { balance: newBalance };
};
