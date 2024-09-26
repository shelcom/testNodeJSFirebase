import {RouterContext} from '@koa/router';
import Koa from 'koa';
import PushNotificationService from 'services/pushNotificationService';
import {singleton} from 'tsyringe';

@singleton()
class PushNotificationController {
  constructor(private pushNotificationService: PushNotificationService) {}

  register = async (ctx: RouterContext, next: Koa.Next) => {
    const {identifier, platform} = ctx.request.body;
    const user = ctx.user;
    await this.pushNotificationService.register(identifier, platform, user);
    ctx.body = {};
  };
}

export default PushNotificationController;
