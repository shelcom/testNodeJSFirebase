import {RestaurantsOrders} from 'models/database/restaurant_order';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class RestaurantOrderRepository extends BaseRepository<RestaurantsOrders> {
  constructor() {
    super(RestaurantsOrders);
  }
}
