import {DevicePlatform} from 'models/devicePlatform';
import {Model} from 'objection';

export interface IPurchase {
  id: number;
  receipt: string;
  platform: DevicePlatform;
  product_id: string;
  expiration_date: string;
  transaction_id: string;
  user_id: number;
}

export class Purchase extends Model implements IPurchase {
  id: number;
  receipt: string;
  platform: DevicePlatform;
  product_id: string;
  expiration_date: string;
  transaction_id: string;
  user_id: number;

  static get tableName() {
    return 'Purchases';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'receipt',
        'platform',
        'product_id',
        'expiration_date',
        'transaction_id',
        'user_id',
      ],

      properties: {
        id: {type: 'integer'},
        receipt: {type: 'string'},
        platform: {type: 'string'},
        product_id: {type: 'string'},
        expiration_date: {type: 'string'},
        transaction_id: {type: 'string'},
        user_id: {type: 'integer'},
      },
    };
  }
}
