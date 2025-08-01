import { Router } from 'express';
//import { fundWallet, getWalletBalance, transferFunds } from '../controllers/wallet.controller';
import { fundWallet, withdrawWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Fund Wallet
router.post('/fund', authenticate, fundWallet);

// Withdraw from wallet.
router.post('/withdraw', authenticate,  withdrawWallet);

// Get Wallet Balance
//router.get('/wallet/balance', authenticate, getWalletBalance);

// Transfer Funds
//router.post('/wallet/transfer', authenticate, transferFunds);

export default router;

