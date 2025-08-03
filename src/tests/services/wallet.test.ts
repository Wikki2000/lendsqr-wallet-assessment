import {
  fundWalletService,
  withdrawWalletService,
  transferFundsService,
} from '../../services/wallet.service';
import db from '../../db/knex';
import type { User } from '../../models/types/User';
import type { Wallet } from '../../models/types/Wallet';

describe('WalletService - fundWalletService', () => {
  let testUserId: string = 'yfdtfgutdrxtgv';
  let testWalletId: string = 'ewtdrdyfyf';
  const testEmail = 'fundtest@example.com';
  const idempotencyKey = 'hkbvcvfrxed';
  const amount = 500;
  const userAccount = '12345678910';

  let recipientId: string = 'recipient-user-id';
  let recipientWalletId: string = 'recipient-wallet-id';
  const recipientEmail = 'recipient@example.com';
  const recipientAccount = '22222222222';

  beforeAll(async () => {
    // Sender setup
    await db('users').insert({
      id: testUserId,
      email: testEmail,
      userName: 'fundTester',
      firstName: 'Test',
      lastName: 'User',
      password: '12345',
      phone: '0000000000',
    });

    await db('wallets').insert({
      id: testWalletId,
      accountNumber: userAccount,
      userId: testUserId,
    });

    // Recipient setup
    await db('users').insert({
      id: recipientId,
      email: recipientEmail,
      userName: 'recipientUser',
      firstName: 'Receiver',
      lastName: 'User',
      password: '54321',
      phone: '1111111111',
    });

    await db('wallets').insert({
      id: recipientWalletId,
      accountNumber: recipientAccount,
      userId: recipientId,
    });
  });

  afterAll(async () => {
    await db('transactions').whereIn('walletId', [testWalletId, recipientWalletId]).delete();
    await db('wallets').whereIn('id', [testWalletId, recipientWalletId]).delete();
    await db('users').whereIn('id', [testUserId, recipientId]).delete();
    await db.destroy();
  });

  test('should fund wallet', async () => {
    const result1 = await fundWalletService(testUserId, amount, idempotencyKey);
    expect(result1.balance).toBe(500);
  });

  test('should withdraw from wallet', async () => {
    const withdrawKey = `withdraw-${Date.now()}`;
    const withdrawAmount = 200;
    const result = await withdrawWalletService(testUserId, withdrawAmount, withdrawKey);
    expect(result.balance).toBe(300); // 500 - 200
  });

  test('should not withdraw more than available balance', async () => {
    const withdrawKey = `withdraw-fail-${Date.now()}`;
    const withdrawAmount = 1000;
    await expect(
      withdrawWalletService(testUserId, withdrawAmount, withdrawKey)
    ).rejects.toThrow('Insufficient funds');
  });

  // Transfer Fund
  test('should transfer funds to another user', async () => {
    // First fund the sender wallet again
    const fundAgainKey = `fund-${Date.now()}`;
    await fundWalletService(testUserId, 200, fundAgainKey);

    const result = await transferFundsService(testUserId, recipientAccount, 100);

    expect(result.message).toContain('Successfully transferred N100');

    const senderWallet = await db('wallets').where({ id: testWalletId }).first();
    const recipientWallet = await db('wallets').where({ id: recipientWalletId }).first();

    expect(Number(senderWallet.balance)).toBe(400); // 500 - 100
    expect(Number(recipientWallet.balance)).toBe(100); // 0 + 100
  });

  test('should not transfer if insufficient balance', async () => {
    await expect(
      transferFundsService(testUserId, recipientAccount, 9999)
    ).rejects.toThrow('Insufficient balance');
  });

  test('should not transfer to invalid account', async () => {
    await expect(
      transferFundsService(testUserId, '99999999999', 100)
    ).rejects.toThrow('Wallet Not Found');
  });

  test('should not transfer to self', async () => {
    await expect(
      transferFundsService(testUserId, userAccount, 100)
    ).rejects.toThrow('Invalid recipient');
  });
});

