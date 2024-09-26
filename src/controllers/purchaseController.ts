import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {DevicePlatform} from 'models/devicePlatform';
import PurchaseService from 'services/purchaseService';
import {singleton} from 'tsyringe';

interface Platform {
  receipt: string;
  platform: DevicePlatform;
}

@singleton()
class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  verify = async (ctx: RouterContext, next: Koa.Next) => {
    const {receipt, platform} = ctx.request.body as Platform;
    const userId = ctx.user.id;
    await this.purchaseService.verify(receipt, platform, userId);
    ctx.body = {};
  };
}

export default PurchaseController;
