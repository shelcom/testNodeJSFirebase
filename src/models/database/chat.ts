import {Model} from 'objection';

export interface IChat {
  id: number;
  name: string;
  owner_id: number;
  user_id: number;
}

export class Chat extends Model implements IChat {
  id: number;
  name: string;
  owner_id: number;
  user_id: number;

  static get tableName() {
    return 'Chats';
  }

  static get relationMappings() {
    const {User} = require('./user');

    return {
      owner: {
        relation: Model.HasOneRelation,
        modelClass: Chat,
        join: {
          from: 'Chats.owner_id',
          to: 'Chats.id',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'Chats.user_id',
          to: 'Users.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'owner_id', 'user_id'],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        owner_id: {type: 'integer'},
        user_id: {type: 'integer'},
      },
    };
  }
}
