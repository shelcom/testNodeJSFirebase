import {Restaurant} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class RestaurantRepository extends BaseRepository<Restaurant> {
  constructor() {
    super(Restaurant);
  }
}
