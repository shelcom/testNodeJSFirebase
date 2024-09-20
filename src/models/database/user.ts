import {Model} from 'objection';
import {IUserPasskeys} from './userPasskeys';
import {IUserPassword} from './userPassword';

export interface IUser {
  id: number;
  email: string;
  role: string;
  passkeys?: IUserPasskeys;
  passwords?: IUserPassword;
}

export enum UserRole {
  user = 'USER',
  serviceProvider = 'SERVICE_PROVIDER',
  delivery = 'DELIVERY',
}

export enum RegistrationType {
  password = 'password',
  passkeys = 'passkeys',
}

export class User extends Model implements IUser {
  id: number;
  email: string;
  role: string;
  passkeys?: IUserPasskeys;
  passwords?: IUserPassword;

  static get tableName() {
    return 'Users';
  }

  static get relationMappings() {
    const {UserPasskeys} = require('./userPasskeys');
    const {UserPassword} = require('./userPassword');

    return {
      passkeys: {
        relation: Model.HasOneRelation,
        modelClass: UserPasskeys,
        join: {
          from: 'Users.id',
          to: 'User_Passkeys.user_id',
        },
      },
      passwords: {
        relation: Model.HasOneRelation,
        modelClass: UserPassword,
        join: {
          from: 'Users.id',
          to: 'User_Passwords.user_id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'role'],

      properties: {
        id: {type: 'integer'},
        email: {type: 'string'},
        role: {type: 'string', default: UserRole.user},
      },
    };
  }
}
