import {Model} from 'objection';

export interface IToken {
  refresh_token: string;
  forget_password_token: string;
  userId: number;
}

export class Token extends Model implements IToken {
  refresh_token: string;
  forget_password_token: string;
  userId: number;

  static get tableName() {
    return 'Tokens';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId'],

      properties: {
        id: {type: 'integer'},
        refresh_token: {type: 'string'},
        forget_password_token: {type: 'string'},
        userId: {type: 'integer'},
      },
    };
  }

  static get relationMappings() {
    const {User} = require('./user');

    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'Tokens.userId',
          to: 'Users.id',
        },
      },
    };
  }
}
