/**
 * Schema interface for a Wallet.
 */
export interface Wallet {
  id: string;
  userId: string;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

