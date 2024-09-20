import ApiError from 'errors/ApiError';
import {PlatformSpecificPurchaseModel} from 'models/database/platformSpecificPurchaseModel';
import {DevicePlatform} from 'models/devicePlatform';
import PurchaseRepository from 'repositories/purchaseRepository';
import strings from 'strings';
import {delay, inject, injectable} from 'tsyringe';
import ApplePurchaseService from './applePurchaseService';

@injectable()
class PurchaseService {
  constructor(
    private purchaseRepository: PurchaseRepository,
    private applePurchaseService: ApplePurchaseService,
  ) {}

  verify = async (
    receipt: string,
    platform: DevicePlatform,
    userId: number,
  ) => {
    let specificPurchaseData: PlatformSpecificPurchaseModel = null;
    if (platform == DevicePlatform.apple) {
      specificPurchaseData = await this.applePurchaseService.verify(receipt);
    }

    if (specificPurchaseData.expirationDate < new Date().toISOString()) {
      throw ApiError.unprocessableEntity(strings.purchase.receiptNotValid);
    }

    const purchaseWithTheSameReceipt =
      await this.purchaseRepository.findOneByCondition({receipt});

    if (
      purchaseWithTheSameReceipt.user_id != userId &&
      purchaseWithTheSameReceipt.receipt == receipt
    ) {
      throw ApiError.unprocessableEntity(strings.purchase.receiptsAlreadyExist);
    }

    const purchase = await this.purchaseRepository.findOneByCondition({
      user_id: userId,
    });

    if (purchase) {
      purchase.receipt = receipt;
      purchase.platform = platform;
      purchase.product_id = specificPurchaseData.productId;
      purchase.expiration_date = specificPurchaseData.expirationDate;
      purchase.transaction_id = specificPurchaseData.transactionId;
      await this.purchaseRepository.update(purchase);
      return;
    }

    await this.purchaseRepository.create({
      receipt,
      platform,
      product_id: specificPurchaseData.productId,
      expiration_date: specificPurchaseData.expirationDate,
      transaction_id: specificPurchaseData.transactionId,
      user_id: userId,
    });
  };

  checkSubscriptions = async () => {
    const nowDate = new Date().toISOString();
    const purchases = await this.purchaseRepository.getAll({
      whereParams: {
        name: 'expiration_date',
        conditionMark: '<',
        value: nowDate,
      },
    });

    console.log('purchases', purchases);
    purchases.forEach(async (item) => {
      const result = await this.checkIfValid(item.receipt, item.platform);
      if (result) {
        await this.purchaseRepository.updatePurchase(item, result);
      } else {
        await this.purchaseRepository.delete(item);
      }
    });
  };

  private checkIfValid = async (receipt: string, platform: DevicePlatform) => {
    try {
      if (platform == DevicePlatform.apple) {
        return await this.applePurchaseService.verify(receipt);
      }
    } catch (e) {
      return null;
    }
  };
}

export default PurchaseService;
