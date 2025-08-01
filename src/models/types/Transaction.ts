/**
 * Schema interface for a Transaction.
 */
export interface Transaction {
  id: string;
  userId: string;
  type: 'fund' | 'transfer' | 'withdraw'; // Example enum values
  amount: number;
  recipientId: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

