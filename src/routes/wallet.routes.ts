import { Router } from 'express';
import {
  fundWallet, withdrawWallet, transferFunds
} from '../controllers/wallet.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/fund', authenticate, fundWallet);
router.post('/withdraw', authenticate,  withdrawWallet);
router.post('/transfer', authenticate, transferFunds);

export default router;

