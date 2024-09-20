import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {ImageType} from 'models/imageType';
import DishService from 'services/dishService';
import {singleton} from 'tsyringe';
import ImageController from 'controllers/imageController';
import BaseController from './baseController';

@singleton()
class DishController extends BaseController {
  constructor(
    private dishService: DishService,
    private imageController: ImageController,
  ) {
    super();
  }

  create = async (ctx: RouterContext, next: Koa.Next) => {
    const {name, description, images, price, type} = ctx.request.body;
    const {restaurantId} = ctx.params;
    const restaurantIdInt = parseInt(restaurantId);
    const currentUserId = ctx.user.id;

    const data = await this.dishService.create(
      {
        name,
        description,
        images,
        restaurantId: restaurantIdInt,
        price,
        type,
      },
      currentUserId,
    );

    ctx.status = 201;
    ctx.body = {data};
  };

  update = async (ctx: RouterContext, next: Koa.Next) => {
    const {name, description, images, price, type} = ctx.request.body;
    const {id} = ctx.params;
    const idInt = parseInt(id);
    const currentUserId = ctx.user.id;

    const data = await this.dishService.update(
      {
        id: idInt,
        name,
        description,
        images,
        price,
        type,
      },
      currentUserId,
    );

    ctx.body = {data};
  };

  getOne = async (ctx: RouterContext, next: Koa.Next) => {
    const {id} = ctx.params;
    const idInt = parseInt(id);
    const data = await this.dishService.getOne(idInt);
    ctx.body = {data};
  };

  getAll = async (ctx: RouterContext, next: Koa.Next) => {
    const {restaurantId} = ctx.params;
    const restaurantIdInt = parseInt(restaurantId);
    const {page, per_page} = ctx.query;
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);

    const data = await this.dishService.getAllForRestaurant(
      pageInt,
      perPageInt,
      restaurantIdInt,
    );

    ctx.body = this.paginationBody({
      data: data,
      page: pageInt,
      perPage: perPageInt,
    });
  };

  uploadImage = async (ctx: RouterContext, next: Koa.Next) => {
    await this.imageController.save(ctx, next, ImageType.dish);
  };
}

export default DishController;
