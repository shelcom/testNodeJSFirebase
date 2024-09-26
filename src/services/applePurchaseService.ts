import ApiError from 'errors/ApiError';
import {IUser} from 'models/database/user';
import {PaymentStatus} from 'models/paymentStatus';
import PaymentRepository from 'repositories/paymentRepository';
import strings from 'strings';
import {delay, inject, injectable} from 'tsyringe';
import appleReceiptVerify from 'node-apple-receipt-verify';

@injectable()
class ApplePurchaseService {
  constructor() {
    appleReceiptVerify.config({
      secret: process.env.APPLE_PURCHASE_SECRET,
      environment: ['sandbox'],
    });
  }

  verify = async (receipt: string) => {
    const products = await appleReceiptVerify.validate({
      receipt,
    });

    console.log(products);
    if (products.length <= 0) {
      throw ApiError.unprocessableEntity(strings.purchase.receiptNotValid);
    }

    const product = products[0];

    return {
      productId: product.productId,
      expirationDate: new Date(product.expirationDate).toISOString(),
      transactionId: product.transactionId,
    };
  };
}

export default ApplePurchaseService;
