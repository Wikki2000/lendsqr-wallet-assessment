import { Request, Response } from 'express';
import { loginUser } from '../services/user.service';

export const login = async (req: Request, res: Response) => {
  const { email, userName, password } = req.body;

  if (!email && !userName) {
    return res.status(400).json({ message: 'Email or userName is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const data = email
    ? { email, password }
    : { userName, password };

  try {
    const token: string | null = await loginUser(data);
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

