import { fundWalletService } from '../../services/wallet.service';
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

  test('Should prevent duplicate with same idempotency key', async () => {

    // Duplicate attempt with same idempotency key
    const result2 = await fundWalletService(testUserId, amount, idempotencyKey);
    console.log(result2.balance, typeof result2.balance);
    expect(result2.balance).toBe(500);
    expect(result2.message).toBe('Duplicate transaction ignored');

  });
});

