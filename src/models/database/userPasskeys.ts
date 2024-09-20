import {Model} from 'objection';
import {IPasskeysAuthenticator} from './passkeysAuthenticator';

export interface IUserPasskeys {
  id: number;
  challenge: string;
  user_id: number;
  credential_id?: string;
  authenticator?: IPasskeysAuthenticator;
}

export class UserPasskeys extends Model implements IUserPasskeys {
  id: number;
  challenge: string;
  user_id: number;
  credential_id?: string;
  authenticator?: IPasskeysAuthenticator;

  static get tableName() {
    return 'User_Passkeys';
  }

  static get relationMappings() {
    const {PasskeysAuthenticator} = require('./passkeysAuthenticator');

    return {
      authenticator: {
        relation: Model.HasOneRelation,
        modelClass: PasskeysAuthenticator,
        join: {
          from: 'User_Passkeys.id',
          to: 'Passkeys_Authenticator.user_passkeys_id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['challenge', 'user_id'],

      properties: {
        id: {type: 'integer'},
        challenge: {type: 'string'},
        user_id: {type: 'integer'},
        credential_id: {type: 'string'},
      },
    };
  }
}
