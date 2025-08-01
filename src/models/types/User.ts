/**
 * Schema interface for a User.
 */
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

