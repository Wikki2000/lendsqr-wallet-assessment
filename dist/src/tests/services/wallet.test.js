"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_service_1 = require("../../services/wallet.service");
const knex_1 = __importDefault(require("../../db/knex"));
describe('WalletService - fundWalletService', () => {
    let testUserId = 'yfdtfgutdrxtgv';
    let testWalletId = 'ewtdrdyfyf';
    const testEmail = 'fundtest@example.com';
    const idempotencyKey = 'hkbvcvfrxed';
    const amount = 500;
    const userAccount = '12345678910';
    let recipientId = 'recipient-user-id';
    let recipientWalletId = 'recipient-wallet-id';
    const recipientEmail = 'recipient@example.com';
    const recipientAccount = '22222222222';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Sender setup
        yield (0, knex_1.default)('users').insert({
            id: testUserId,
            email: testEmail,
            userName: 'fundTester',
            firstName: 'Test',
            lastName: 'User',
            password: '12345',
            phone: '0000000000',
        });
        yield (0, knex_1.default)('wallets').insert({
            id: testWalletId,
            accountNumber: userAccount,
            userId: testUserId,
        });
        // Recipient setup
        yield (0, knex_1.default)('users').insert({
            id: recipientId,
            email: recipientEmail,
            userName: 'recipientUser',
            firstName: 'Receiver',
            lastName: 'User',
            password: '54321',
            phone: '1111111111',
        });
        yield (0, knex_1.default)('wallets').insert({
            id: recipientWalletId,
            accountNumber: recipientAccount,
            userId: recipientId,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, knex_1.default)('transactions').whereIn('walletId', [testWalletId, recipientWalletId]).delete();
        yield (0, knex_1.default)('wallets').whereIn('id', [testWalletId, recipientWalletId]).delete();
        yield (0, knex_1.default)('users').whereIn('id', [testUserId, recipientId]).delete();
        yield knex_1.default.destroy();
    }));
    test('should fund wallet', () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield (0, wallet_service_1.fundWalletService)(testUserId, amount, idempotencyKey);
        expect(result1.balance).toBe(500);
    }));
    test('should withdraw from wallet', () => __awaiter(void 0, void 0, void 0, function* () {
        const withdrawKey = `withdraw-${Date.now()}`;
        const withdrawAmount = 200;
        const result = yield (0, wallet_service_1.withdrawWalletService)(testUserId, withdrawAmount, withdrawKey);
        expect(result.balance).toBe(300); // 500 - 200
    }));
    test('should not withdraw more than available balance', () => __awaiter(void 0, void 0, void 0, function* () {
        const withdrawKey = `withdraw-fail-${Date.now()}`;
        const withdrawAmount = 1000;
        yield expect((0, wallet_service_1.withdrawWalletService)(testUserId, withdrawAmount, withdrawKey)).rejects.toThrow('Insufficient funds');
    }));
    // Transfer Fund
    test('should transfer funds to another user', () => __awaiter(void 0, void 0, void 0, function* () {
        // First fund the sender wallet again
        const fundAgainKey = `fund-${Date.now()}`;
        yield (0, wallet_service_1.fundWalletService)(testUserId, 200, fundAgainKey);
        const result = yield (0, wallet_service_1.transferFundsService)(testUserId, recipientAccount, 100);
        expect(result.message).toContain('Successfully transferred ₦100');
        const senderWallet = yield (0, knex_1.default)('wallets').where({ id: testWalletId }).first();
        const recipientWallet = yield (0, knex_1.default)('wallets').where({ id: recipientWalletId }).first();
        expect(Number(senderWallet.balance)).toBe(400); // 500 - 100
        expect(Number(recipientWallet.balance)).toBe(100); // 0 + 100
    }));
    test('should not transfer if insufficient balance', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, wallet_service_1.transferFundsService)(testUserId, recipientAccount, 9999)).rejects.toThrow('Insufficient balance');
    }));
    test('should not transfer to invalid account', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, wallet_service_1.transferFundsService)(testUserId, '99999999999', 100)).rejects.toThrow('Invalid recipient');
    }));
    test('should not transfer to self', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, wallet_service_1.transferFundsService)(testUserId, userAccount, 100)).rejects.toThrow('Invalid recipient');
    }));
});
