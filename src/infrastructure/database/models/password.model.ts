import {Model} from 'objection';

export interface IPassword {
  id: string;
  password: string;
  userId: string;
}

export class PasswordDatabaseModel extends Model implements IPassword {
  id: string;
  password: string;
  userId: string;

  static get tableName() {
    return 'UserPasswords';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['password', 'userId'],
      properties: {
        id: {type: 'string', format: 'uuid'},
        password: {type: 'string'},
        userId: {type: 'string', format: 'uuid'},
      },
    };
  }
}
