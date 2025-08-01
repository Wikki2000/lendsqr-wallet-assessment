import { Response } from 'express';
import {
  fundWalletService, withdrawWalletService, transferFundsService
} from '../services/wallet.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { isMissingFields, isValidAmount } from '../utils/validate.utils';
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

    const { valid, message } = isValidAmount(amount);
    if (!valid) {
      return res.status(400).json({ message });
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


export const withdrawWallet = async (req: AuthRequest, res: Response) => {
  try {
    const requiredFields = ['amount', 'idempotencyKey'];
    const data: Record<string, any> = req.body;
    const missingValue = isMissingFields(requiredFields, data);

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

    const { valid, message } = isValidAmount(amount);
    if (!valid) {
      return res.status(400).json({ message });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
    }

    const wallet = await withdrawWalletService(userId, amount, idempotencyKey);
    res.status(200).json({ message: 'Withdrawal successful', wallet });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to withdraw', error: message });
  }
};


export const transferFunds = async (req: AuthRequest, res: Response) => {
  try {
    const requiredFields = ['recipientAccount', 'amount'];
    const data = req.body;

    const missingField = isMissingFields(requiredFields, data);
    if (missingField) {
      return res.status(400).json({ message: `${missingField} is required` });
    }

    const senderId = req.user?.id; // from JWT middleware

    if (!senderId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { recipientAccount, amount } = data;

    const result = await transferFundsService(senderId, recipientAccount, Number(amount));

    return res.status(200).json({
      message: result.message
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

