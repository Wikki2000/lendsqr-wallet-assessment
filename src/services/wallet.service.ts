import { BaseModel } from '../models/BaseModel';
import { v4 as uuidv4 } from 'uuid';
import type { Wallet } from '../models/types/Wallet';
import type { Transaction } from '../models/types/Transaction';


//const userModal = new BaseModel<User>('users');
const walletModel = new BaseModel<Wallet>('wallets');
const transactionModel = new BaseModel<Transaction>('transactions');

export const fundWalletService = async (
  userId: string,
  amount: number,
  idempotencyKey: string
) => {
  const wallet: Wallet = await walletModel.getBy({ userId });
  if (!wallet) throw new Error('Wallet not found');

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


export const withdrawWalletService = async (
  userId: string,
  amount: number,
  idempotencyKey: string
) => {
  const wallet: Wallet = await walletModel.getBy({ userId });
  if (!wallet) throw new Error('Wallet not found');

  const currentBalance = Number(wallet.balance);
  if (currentBalance < amount) {
    throw new Error('Insufficient funds');
  }

  const newBalance = currentBalance - amount;

  // Update wallet balance
  await walletModel.updateBy('id', wallet.id, { balance: newBalance });

  // Add transaction
  await transactionModel.add({
    id: uuidv4(),
    walletId: wallet.id,
    type: 'withdraw',
    amount,
    recipientId: wallet.userId,
    description: 'Wallet withdrawal',
    idempotencyKey,
  });

  return { balance: newBalance };
};


export const transferFundsService = async (
  senderId: string,
  recipientAccount: string,
  amount: number
) => {
  const senderWallet = await walletModel.getBy({ userId: senderId });
  if (!senderWallet || senderWallet.balance < amount) {
    throw new Error('Insufficient balance');
  }

  const recipientWallet = await walletModel.getBy({ accountNumber: recipientAccount });

  // Handle error for invalid account number
  if (
    recipientWallet?.userId === senderId ||
    recipientAccount.length !== 11 ||
  !/^\d{11}$/.test(recipientAccount)
  ) {
    throw new Error('Invalid recipient');
  }

  // Handle error for missing wallets.
  if (!recipientWallet) {
    throw new Error('Wallet Not Found');
  }

  // Begin transfer
  await walletModel.updateBy('userId', senderId, {
    balance: Number(senderWallet.balance) - amount
  });


  await walletModel.updateBy('userId', recipientWallet.userId, {
    balance: Number(recipientWallet.balance) + amount
  });

  // Record both transactions
  await transactionModel.add({
    id: uuidv4(),
    walletId: senderWallet.id,
    type: 'debit',
    amount,
    description: `Transfer to ${recipientWallet.accountNumber}`
  });

  await transactionModel.add({
    id: uuidv4(),
    walletId: recipientWallet.id,
    type: 'credit',
    amount,
    description: `Received from ${senderId}`
  });

  return {
    message: `Successfully transferred N${amount.toLocaleString()} to ${recipientAccount}`
  };
};
