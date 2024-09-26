import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {singleton} from 'tsyringe';
import BaseController from './baseController';
import PaymentService from 'services/paymentService';

@singleton()
class PaymentController extends BaseController {
  constructor(private paymentService: PaymentService) {
    super();
  }

  confirmPayment = async (ctx: RouterContext, next: Koa.Next) => {
    const id = ctx.params.id;
    const idInt = parseInt(id);

    await this.paymentService.confirmPayment(idInt);

    ctx.body = {};
  };

  getPayment = async (ctx: RouterContext, next: Koa.Next) => {
    const id = ctx.params.id;
    const idInt = parseInt(id);

    const data = await this.paymentService.getPayment(idInt);

    ctx.body = {data};
  };
}

export default PaymentController;
