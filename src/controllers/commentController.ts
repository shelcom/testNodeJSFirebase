import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {singleton} from 'tsyringe';
import BaseController from './baseController';
import CommentService from 'services/commentService';

@singleton()
class CommentController extends BaseController {
  constructor(private commentService: CommentService) {
    super();
  }

  create = async (ctx: RouterContext, next: Koa.Next) => {
    const {comment, rating} = ctx.request.body;
    const id = ctx.params.id;
    const idInt = parseInt(id);
    const userId = ctx.user.id;

    const data = await this.commentService.create(
      {
        comment,
        rating,
        restaurantId: idInt,
      },
      userId,
    );

    ctx.body = {data};
  };

  update = async (ctx: RouterContext, next: Koa.Next) => {
    const {comment, rating} = ctx.request.body;
    const id = ctx.params.id;
    const idInt = parseInt(id);
    const userId = ctx.user.id;

    const data = await this.commentService.update(
      {
        id: idInt,
        comment,
        rating,
      },
      userId,
    );

    ctx.body = {data};
  };

  getAll = async (ctx: RouterContext, next: Koa.Next) => {
    const id = ctx.params.id;
    const restaurantIdInt = parseInt(id);

    const {page, per_page} = ctx.query;
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);

    const data = await this.commentService.getAllForRestaurant(
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
}

export default CommentController;
