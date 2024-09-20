import {DishType} from 'models/dishType';
import {Model} from 'objection';

export interface IDish {
  id: number;
  name: string;
  description: string;
  images: string[];
  restaurant_id: number;
  price: number;
  type: DishType;
}

export class Dish extends Model implements IDish {
  id: number;
  name: string;
  description: string;
  images: string[];
  restaurant_id: number;
  price: number;
  type: DishType;

  static get tableName() {
    return 'Dishes';
  }

  static get jsonAttributes() {
    return [];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'name',
        'description',
        'images',
        'restaurant_id',
        'price',
        'type',
      ],

      properties: {
        id: {type: 'integer'},
        name: {type: 'string'},
        description: {type: 'string'},
        restaurant_id: {type: 'integer'},
        images: {type: 'array', items: {type: 'string'}},
        price: {type: 'integer'},
        type: {type: 'string', default: DishType.regular},
      },
    };
  }
}
