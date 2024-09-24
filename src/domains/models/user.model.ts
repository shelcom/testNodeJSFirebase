import {IPassword} from '@infrastructure/database/models/password.model';

export interface IUser {
  id: string;
  email: string;
  role: string;
  passwords?: IPassword;
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export class UserDomainModel implements IUser {
  id: string;
  email: string;
  role: string;
  passwords?: IPassword;

  constructor(id: string, email: string, role: string, passwords?: IPassword) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.passwords = passwords;
  }
}
