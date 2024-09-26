import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {singleton} from 'tsyringe';
import OrderService from 'services/orderService';
import BaseController from './baseController';
import {UserRole} from 'models/database/user';

@singleton()
class OrderController extends BaseController {
  constructor(private orderService: OrderService) {
    super();
  }

  create = async (ctx: RouterContext, next: Koa.Next) => {
    const {name, comment, dish_ids, address, delivery_time} = ctx.request.body;

    const {id} = ctx.params;
    const idInt = parseInt(id);
    const user = ctx.user;

    const data = await this.orderService.create(
      {
        restaurantId: idInt,
        name,
        comment,
        dishIds: dish_ids,
        address,
        deliveryTime: delivery_time,
      },
      user,
    );

    ctx.status = 201;
    ctx.body = {data};
  };

  delete = async (ctx: RouterContext, next: Koa.Next) => {
    const {id} = ctx.params;
    const idInt = parseInt(id);
    const userId = ctx.user.id;
    await this.orderService.delete(idInt, userId);
    ctx.body = {};
  };

  getAllForRestaurant = async (ctx: RouterContext, next: Koa.Next) => {
    const {page, per_page} = ctx.query;
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);
    const restaurantId = parseInt(ctx.params.id);

    let userId = null;
    if (ctx.user.role == UserRole.user) {
      userId = ctx.user.id;
    }

    const data = await this.orderService.getAllForRestaurant(
      pageInt,
      perPageInt,
      restaurantId,
      userId,
    );

    ctx.body = this.paginationBody({
      data,
      page: pageInt,
      perPage: perPageInt,
    });
  };

  getAll = async (ctx: RouterContext, next: Koa.Next) => {
    const {page, per_page} = ctx.query;
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);

    let userId = null;
    if (ctx.user.role == UserRole.user) {
      userId = ctx.user.id;
    }

    const data = await this.orderService.getAll(pageInt, perPageInt, userId);

    ctx.body = this.paginationBody({
      data,
      page: pageInt,
      perPage: perPageInt,
    });
  };

  changeStatus = async (ctx: RouterContext, next: Koa.Next) => {
    const id = parseInt(ctx.params.id);
    const {status} = ctx.request.body;
    const data = await this.orderService.changeStatus(id, status);
    ctx.body = {data};
  };
}

export default OrderController;
