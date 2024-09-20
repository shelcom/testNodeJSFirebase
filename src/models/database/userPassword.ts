import {Model} from 'objection';

export interface IUserPassword {
  id: number;
  password: string;
  forget_password_token: string;
  user_id: number;
}

export class UserPassword extends Model implements IUserPassword {
  id: number;
  password: string;
  forget_password_token: string;
  user_id: number;

  static get tableName() {
    return 'User_Passwords';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['password', 'user_id'],

      properties: {
        id: {type: 'integer'},
        password: {type: 'string'},
        forget_password_token: {type: 'string'},
        user_id: {type: 'integer'},
      },
    };
  }
}
