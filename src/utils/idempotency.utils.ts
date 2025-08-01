import { BaseModel } from '../models/BaseModel';
import type { Transaction } from '../models/types/Transaction';

const transactionModel = new BaseModel<Transaction>('transactions');

export async function isDuplicateTransaction(idempotencyKey: string): Promise<boolean> {
  const existing = await transactionModel.getBy({ idempotencyKey });
  return !!existing;
}

