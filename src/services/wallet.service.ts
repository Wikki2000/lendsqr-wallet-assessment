import { BaseModel } from '../models/BaseModel';
import { v4 as uuidv4 } from 'uuid';
import type { Wallet } from '../models/types/Wallet';
import type { Transaction } from '../models/types/Transaction';


const walletModel = new BaseModel<Wallet>('wallets');
const transactionModel = new BaseModel<Transaction>('transactions');

export const fundWalletService = async (
  userId: string,
  amount: number,
  idempotencyKey: string
) => {
  const wallet: Wallet = await walletModel.getBy({ userId });
  if (!wallet) throw new Error('Wallet not found');

  // Check if a transaction with this idempotency key already exists
  /*
  const existing = await transactionModel.getBy({ idempotencyKey });
  if (existing) {
    return { balance: Number(wallet.balance), message: 'Duplicate transaction ignored' };
  }*/

  const newBalance = Number(wallet.balance) + Number(amount);

  // Update wallet balance
  await walletModel.updateBy('id', wallet.id, { balance: newBalance });

  // Add transaction with idempotency key
  await transactionModel.add({
    id: uuidv4(),
    walletId: wallet.id,
    type: 'fund',
    amount,
    recipientId: wallet.userId,
    description: 'Wallet funded',
    idempotencyKey,
  });

  return { balance: newBalance };
};
