import {PlatformSpecificPurchaseModel} from 'models/database/platformSpecificPurchaseModel';
import {Purchase} from 'models/database/purchase';
import {injectable} from 'tsyringe';
import BaseRepository from './baseRepository';

@injectable()
export default class PurchaseRepository extends BaseRepository<Purchase> {
  constructor() {
    super(Purchase);
  }

  updatePurchase = async (
    purchase: Purchase,
    model: PlatformSpecificPurchaseModel,
  ) => {
    purchase.product_id = model.productId;
    purchase.expiration_date = model.expirationDate;
    purchase.transaction_id = model.transactionId;
    await this.update(purchase);
  };
}
