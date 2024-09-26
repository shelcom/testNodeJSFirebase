import {Model} from 'objection';
import {Location} from 'models/location';

export interface IRestaurant {
  owner_id: number;
  name: string;
  description: string;
  location: Location;
  images: string[];
}

export class Restaurant extends Model implements IRestaurant {
  name: string;
  description: string;
  owner_id: number;
  location: Location;
  images: string[];

  static get tableName() {
    return 'Restaurants';
  }

  static get jsonAttributes() {
    return [];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'owner_id', 'images'],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        description: {type: 'string'},
        images: {type: 'array', items: {type: 'string'}},
        owner_id: {type: 'integer'},
        location: {
          type: 'object',
          properties: {
            latitude: {type: 'string'},
            longitude: {type: 'string'},
          },
        },
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
          from: 'Restaurants.owner_id',
          to: 'Users.id',
        },
      },
    };
  }
}
