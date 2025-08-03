import { Request, Response } from 'express';
import axios from 'axios';
import { createUser } from '../services/user.service';
import { isMissingFields } from '../utils/validate.utils';
import { validatePasswordStrength } from '../utils/password.utils';

const KARMA_API_URL = 'https://adjutor.lendsqr.com/v2/verification/karma/';
const KARMA_API_KEY = process.env.KARMA_API_KEY!;

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

    // Check if user is in Lendsqr blacklist
    try {
      const karmaRes = await axios.get(`${KARMA_API_URL}${email}`, {
        headers: {
          Authorization: `Bearer ${KARMA_API_KEY}`
        }
      });

      const kamData = karmaRes.data as {
        data?: {
          karma_type?: string;
        };
      };

      /*
      if (kamData.data?.karma_type) {
        return res.status(403).json({
          message: 'User is blacklisted in the Lendsqr Karma database and cannot be onboarded.',
        });
      }*/

    } catch (error: unknown) {
      const err = error as Error;
      return res.status(502).json({ message: 'Failed to verify user with Karma API' });
    }

    // Validate password strength
    const strengthMsg: string | null = validatePasswordStrength(password);
    if (strengthMsg) {
      return res.status(422).json({ message: strengthMsg });
    }

    // Create user
    const userId = await createUser({
      email, firstName, lastName, phone, userName, password
    });

    return res.status(200).json({
      message: 'User created successfully',
      user_id: userId,
    });

  } catch (error: any) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

