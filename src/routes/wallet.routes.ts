import { Router } from 'express';
//import { fundWallet, getWalletBalance, transferFunds } from '../controllers/wallet.controller';
import { fundWallet } from '../controllers/wallet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Fund Wallet
router.post('/wallet/fund', authenticate, fundWallet);

// Get Wallet Balance
//router.get('/wallet/balance', authenticate, getWalletBalance);

// Transfer Funds
//router.post('/wallet/transfer', authenticate, transferFunds);

export default router;

