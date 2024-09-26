import {Payment} from 'models/database';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(Payment);
  }
}
