import { Request, Response } from 'express';
import { loginUser } from '../services/user.service';
import { isMissingFields } from '../utils/validate.utils';

export const login = async (req: Request, res: Response) => {
    const requiredFields: string[] = ['password'];
    const data: Record<string, any> = req.body;
    const missingValue: string | null = isMissingFields(requiredFields, data);

    if (missingValue) {
      return res.status(400).json({ message: `${missingValue} is required` });
    }

  try {
    const token = await loginUser(req.body);
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
