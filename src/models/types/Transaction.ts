/**
 * Schema interface for a Transaction.
 */
export interface Transaction {
  id: string;
  walletId: string;
  type: 'fund' | 'transfer' | 'withdraw';
  amount: number;
  recipientId: string;
  idempotencyKey?: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

