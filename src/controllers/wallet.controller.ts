import { Response } from 'express';
import { fundWalletService } from '../services/wallet.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { isMissingFields } from '../utils/validate.utils';
import { isDuplicateTransaction } from '../utils/idempotency.utils';

export const fundWallet = async (req: AuthRequest, res: Response) => {
  try {
    const requiredFields: string[] = ['amount', 'idempotencyKey'];
    const data: Record<string, any> = req.body;
    const missingValue: string | null = isMissingFields(requiredFields, data);

    if (missingValue) {
      return res.status(400).json({ message: `${missingValue} is required` });
    }

    const { amount, idempotencyKey } = data;

    const existing = await isDuplicateTransaction(idempotencyKey);
    if (existing) {
      return res.status(200).json({
        message: 'Duplicate transaction ignored',
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
    }

    const wallet = await fundWalletService(userId, amount, idempotencyKey);
    res.status(200).json({ message: 'Wallet funded successfully', wallet });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to fund wallet', error: message });
  }
};

