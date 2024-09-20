import {PaymentStatus} from 'models/paymentStatus';
import {Model} from 'objection';

export interface IPayment {
  id: number;
  payment_intent_id: string;
  price: number;
  order_id: number;
  status: PaymentStatus;
}

export class Payment extends Model implements IPayment {
  id: number;
  payment_intent_id: string;
  price: number;
  order_id: number;
  status: PaymentStatus;

  static get tableName() {
    return 'Payments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['payment_intent_id', 'price', 'order_id'],

      properties: {
        id: {type: 'integer'},
        payment_intent_id: {type: 'string'},
        price: {type: 'integer'},
        order_id: {type: 'integer'},
        status: {type: 'string', default: PaymentStatus.incomplete},
      },
    };
  }
}
