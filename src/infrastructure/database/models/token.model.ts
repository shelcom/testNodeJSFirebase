import {Model, RelationMappings} from 'objection';

import {UserDatabaseModel} from './user.model';

export interface TokensModel {
  accessToken: string;
  refreshToken: string;
}

export interface IToken {
  refreshToken: string;
  forgotPasswordToken: string;
  userId: string;
}

export class TokenDatabaseModel extends Model implements IToken {
  id: string;
  refreshToken: string;
  forgotPasswordToken: string;
  userId: string;

  static get tableName() {
    return 'Tokens';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId'],
      properties: {
        id: {type: 'string', format: 'uuid'},
        refreshToken: {type: 'string'},
        forgotPasswordToken: {type: 'string'},
        userId: {type: 'string', format: 'uuid', minLength: 36},
      },
    };
  }

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserDatabaseModel,
        join: {
          from: 'Tokens.userId',
          to: 'Users.id',
        },
      },
    };
  }
}

export type TokenWithRelations = TokenDatabaseModel & {
  user?: UserDatabaseModel;
};
