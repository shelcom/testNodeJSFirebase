import {Model} from 'objection';

export interface IRestaurantsOrders {
  id: number;
  dish_id: number;
  order_id: number;
}

export class RestaurantsOrders extends Model implements IRestaurantsOrders {
  id: number;
  dish_id: number;
  order_id: number;

  static get tableName() {
    return 'Restaurants_Orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['dish_id', 'order_id'],

      properties: {
        id: {type: 'integer'},
        dish_id: {type: 'integer'},
        order_id: {type: 'integer'},
      },
    };
  }
}
