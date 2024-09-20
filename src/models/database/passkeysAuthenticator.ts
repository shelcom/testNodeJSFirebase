import {Model} from 'objection';

export interface IPasskeysAuthenticator {
  id: number;
  credential_id: string;
  credential_public_key: string;
  counter: number;
  user_passkeys_id: number;
}

export class PasskeysAuthenticator
  extends Model
  implements IPasskeysAuthenticator
{
  id: number;
  credential_id: string;
  credential_public_key: string;
  counter: number;
  user_passkeys_id: number;

  static get tableName() {
    return 'Passkeys_Authenticator';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'credential_id',
        'credential_public_key',
        'counter',
        'user_passkeys_id',
      ],

      properties: {
        id: {type: 'integer'},
        credential_id: {type: 'string'},
        credential_public_key: {type: 'string'},
        counter: {type: 'integer'},
        user_passkeys_id: {type: 'integer'},
      },
    };
  }
}
