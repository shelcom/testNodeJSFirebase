import {Order} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(Order);
  }
}
