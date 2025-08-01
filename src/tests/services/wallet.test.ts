import { fundWalletService, withdrawWalletService } from '../../services/wallet.service';
import db from '../../db/knex';
import type { User } from '../../models/types/User';
import type { Wallet } from '../../models/types/Wallet';

describe('WalletService - fundWalletService', () => {
  let testUserId: string = 'yfdtfgutdrxtgv';
  let testWalletId: string = 'ewtdrdyfyf';
  const testEmail = 'fundtest@example.com';
  const idempotencyKey = 'hkbvcvfrxed';
  const amount = 500;

  beforeAll(async () => {
    //await db.migrate.latest();

    // Create test user
    await db('users').insert({
      id: testUserId,
      email: testEmail,
      userName: 'fundTester',
      firstName: 'Test',
      lastName: 'User',
      password: '12345',
      phone: '0000000000',
    });

    // Create wallet for the user
    await db('wallets').insert({
      id: testWalletId,
      userId: testUserId,
      //balance: 0,
    });
  });

  afterAll(async () => {
    await db('transactions').where({ walletId: testWalletId }).delete();
    await db('wallets').where({ id: testWalletId }).delete();
    await db('users').where({ id: testUserId }).delete();
    await db.destroy();
  });

  test('should fund wallet', async () => {
    // First fund attempt
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
});

