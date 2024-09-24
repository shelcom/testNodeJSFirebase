import {Model} from 'objection';

import {IPassword, PasswordDatabaseModel} from './password.model';

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

export class UserDatabaseModel extends Model implements IUser {
  id: string;
  email: string;
  role: string;
  passwords?: IPassword;

  static get tableName() {
    return 'Users';
  }

  static get relationMappings() {
    return {
      passwords: {
        relation: Model.HasOneRelation,
        modelClass: PasswordDatabaseModel,
        join: {
          from: 'Users.id',
          to: 'UserPasswords.userId',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'role'],
      properties: {
        id: {type: 'string', format: 'uuid'},
        email: {type: 'string'},
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          default: UserRole.user,
        },
      },
    };
  }
}
