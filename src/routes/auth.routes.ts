import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { createNewUser } from '../controllers/user.controller';

const router = Router();

router.post('/login', login);
router.post('/register', createNewUser);

export default router;
