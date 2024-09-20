import {Model} from 'objection';

export interface IMessage {
  id: number;
  message: string;
  date: Date;
  chat_id: number;
  owner_id: number;
}

export class Message extends Model implements IMessage {
  id: number;
  message: string;
  date: Date;
  chat_id: number;
  owner_id: number;

  static get tableName() {
    return 'Messages';
  }

  static get relationMappings() {
    const {Chat} = require('./chat');
    const {User} = require('./user');

    return {
      chat: {
        relation: Model.HasOneRelation,
        modelClass: Chat,
        join: {
          from: 'Messages.chat_id',
          to: 'Chats.id',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'Messages.owner_id',
          to: 'Users.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],

      properties: {
        id: {type: 'integer'},
        message: {type: 'string'},
        chat_id: {type: 'integer'},
        date: {type: 'string'},
        owner_id: {type: 'integer'},
      },
    };
  }
}
