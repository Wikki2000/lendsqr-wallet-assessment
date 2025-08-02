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
exports.transferFunds = exports.withdrawWallet = exports.fundWallet = void 0;
const wallet_service_1 = require("../services/wallet.service");
const validate_utils_1 = require("../utils/validate.utils");
const idempotency_utils_1 = require("../utils/idempotency.utils");
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requiredFields = ['amount', 'idempotencyKey'];
        const data = req.body;
        const missingValue = (0, validate_utils_1.isMissingFields)(requiredFields, data);
        if (missingValue) {
            return res.status(400).json({ message: `${missingValue} is required` });
        }
        const { amount, idempotencyKey } = data;
        const existing = yield (0, idempotency_utils_1.isDuplicateTransaction)(idempotencyKey);
        if (existing) {
            return res.status(200).json({
                message: 'Duplicate transaction ignored',
            });
        }
        const { valid, message } = (0, validate_utils_1.isValidAmount)(amount);
        if (!valid) {
            return res.status(400).json({ message });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
        }
        const wallet = yield (0, wallet_service_1.fundWalletService)(userId, amount, idempotencyKey);
        res.status(200).json({ message: 'Wallet funded successfully', wallet });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to fund wallet', error: message });
    }
});
exports.fundWallet = fundWallet;
const withdrawWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requiredFields = ['amount', 'idempotencyKey'];
        const data = req.body;
        const missingValue = (0, validate_utils_1.isMissingFields)(requiredFields, data);
        if (missingValue) {
            return res.status(400).json({ message: `${missingValue} is required` });
        }
        const { amount, idempotencyKey } = data;
        const existing = yield (0, idempotency_utils_1.isDuplicateTransaction)(idempotencyKey);
        if (existing) {
            return res.status(200).json({
                message: 'Duplicate transaction ignored',
            });
        }
        const { valid, message } = (0, validate_utils_1.isValidAmount)(amount);
        if (!valid) {
            return res.status(400).json({ message });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
        }
        const wallet = yield (0, wallet_service_1.withdrawWalletService)(userId, amount, idempotencyKey);
        res.status(200).json({ message: 'Withdrawal successful', wallet });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message: 'Failed to withdraw', error: message });
    }
});
exports.withdrawWallet = withdrawWallet;
const transferFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requiredFields = ['recipientAccount', 'amount'];
        const data = req.body;
        const missingField = (0, validate_utils_1.isMissingFields)(requiredFields, data);
        if (missingField) {
            return res.status(400).json({ message: `${missingField} is required` });
        }
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from JWT middleware
        if (!senderId) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        const { recipientAccount, amount } = data;
        const result = yield (0, wallet_service_1.transferFundsService)(senderId, recipientAccount, Number(amount));
        return res.status(200).json({
            message: result.message
        });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
exports.transferFunds = transferFunds;
