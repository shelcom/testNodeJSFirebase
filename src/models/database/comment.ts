import {Model} from 'objection';

export interface IComment {
  id: number;
  comment: string;
  rating: number;
  restaurant_id: number;
  owner_id: number;
}

export class Comment extends Model implements IComment {
  id: number;
  comment: string;
  rating: number;
  restaurant_id: number;
  owner_id: number;

  static get tableName() {
    return 'Comments';
  }

  static get relationMappings() {
    const {Restaurant} = require('./restaurant');

    return {
      restaurant: {
        relation: Model.HasOneRelation,
        modelClass: Restaurant,
        join: {
          from: 'Comments.restaurant_ids',
          to: 'Restaurant.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['comment', 'rating', 'restaurant_id', 'owner_id'],

      properties: {
        id: {type: 'integer'},
        comment: {type: 'string'},
        rating: {type: 'integer'},
        owner_id: {type: 'integer'},
        restaurant_id: {type: 'integer'},
      },
    };
  }
}
