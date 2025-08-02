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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFundsService = exports.withdrawWalletService = exports.fundWalletService = void 0;
const BaseModel_1 = require("../models/BaseModel");
const uuid_1 = require("uuid");
//const userModal = new BaseModel<User>('users');
const walletModel = new BaseModel_1.BaseModel('wallets');
const transactionModel = new BaseModel_1.BaseModel('transactions');
const fundWalletService = (userId, amount, idempotencyKey) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield walletModel.getBy({ userId });
    if (!wallet)
        throw new Error('Wallet not found');
    const newBalance = Number(wallet.balance) + Number(amount);
    // Update wallet balance
    yield walletModel.updateBy('id', wallet.id, { balance: newBalance });
    // Add transaction with idempotency key
    yield transactionModel.add({
        id: (0, uuid_1.v4)(),
        walletId: wallet.id,
        type: 'fund',
        amount,
        recipientId: wallet.userId,
        description: 'Wallet funded',
        idempotencyKey,
    });
    return { balance: newBalance };
});
exports.fundWalletService = fundWalletService;
const withdrawWalletService = (userId, amount, idempotencyKey) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield walletModel.getBy({ userId });
    if (!wallet)
        throw new Error('Wallet not found');
    const currentBalance = Number(wallet.balance);
    if (currentBalance < amount) {
        throw new Error('Insufficient funds');
    }
    const newBalance = currentBalance - amount;
    // Update wallet balance
    yield walletModel.updateBy('id', wallet.id, { balance: newBalance });
    // Add transaction
    yield transactionModel.add({
        id: (0, uuid_1.v4)(),
        walletId: wallet.id,
        type: 'withdraw',
        amount,
        recipientId: wallet.userId,
        description: 'Wallet withdrawal',
        idempotencyKey,
    });
    return { balance: newBalance };
});
exports.withdrawWalletService = withdrawWalletService;
const transferFundsService = (senderId, recipientAccount, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const senderWallet = yield walletModel.getBy({ userId: senderId });
    if (!senderWallet || senderWallet.balance < amount) {
        throw new Error('Insufficient balance');
    }
    const recipientWallet = yield walletModel.getBy({ accountNumber: recipientAccount });
    if (!recipientWallet || recipientWallet.userId === senderId) {
        throw new Error('Invalid recipient');
    }
    // Begin transfer
    yield walletModel.updateBy('userId', senderId, {
        balance: Number(senderWallet.balance) - amount
    });
    yield walletModel.updateBy('userId', recipientWallet.userId, {
        balance: Number(recipientWallet.balance) + amount
    });
    // Record both transactions
    yield transactionModel.add({
        id: (0, uuid_1.v4)(),
        walletId: senderWallet.id,
        type: 'debit',
        amount,
        description: `Transfer to ${recipientWallet.accountNumber}`
    });
    yield transactionModel.add({
        id: (0, uuid_1.v4)(),
        walletId: recipientWallet.id,
        type: 'credit',
        amount,
        description: `Received from ${senderId}`
    });
    return {
        message: `Successfully transferred ₦${amount.toLocaleString()} to ${recipientAccount}`
    };
});
exports.transferFundsService = transferFundsService;
