import { BaseModel } from '../BaseModel';

/**
 * Schema interface for a User.
 */
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  createdAt?: Date;
}

