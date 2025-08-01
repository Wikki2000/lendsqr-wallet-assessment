import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import { isMissingFields } from '../utils/validate.utils';
import { validatePasswordStrength } from '../utils/password.utils';

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const requiredFields: string[] = [
      'email', 'firstName', 'lastName', 'phone', 'userName', 'password'
    ];
    const data: Record<string, any> = req.body;
    const missingValue: string | null = isMissingFields(requiredFields, data);

    if (missingValue) {
      return res.status(400).json({ message: `${missingValue} is required` });
    }

    const { email, firstName, phone, lastName, userName, password } = req.body;
    const strengthMsg: string | null = validatePasswordStrength(password);
    if (strengthMsg) {
      return res.status(422).json({ message: strengthMsg });
    }

    const userId = await createUser({
      email, firstName, lastName, phone, userName, password
    });

    return res.status(201).json({
      message: 'User created successfully',
      user_id: userId,
    });
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};
