import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {singleton} from 'tsyringe';
import BaseController from './baseController';
import ChatService from 'services/chatService';

interface CreateRequestBody {
  name: string;
}

@singleton()
class ChatController extends BaseController {
  constructor(private chatService: ChatService) {
    super();
  }

  create = async (ctx: RouterContext, next: Koa.Next) => {
    try {
      const {name} = ctx.request.body as CreateRequestBody;
      const userId = ctx.params.user_id;
      const userIdInt = parseInt(userId);
      const ownerId = ctx.user.id;

      const data = await this.chatService.create({
        name,
        ownerId,
        userId: userIdInt,
      });

      ctx.status = 201;
      ctx.body = {data};
    } catch (error) {
      // Error handling
      ctx.status = 500;
      ctx.body = {error: 'Internal Server Error'};
      console.error('Error occurred:', error);
    }
  };

  getAll = async (ctx: RouterContext, next: Koa.Next) => {
    const userId = ctx.user.id;
    const {page, per_page} = ctx.query;
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);

    const data = await this.chatService.getAll(pageInt, perPageInt, userId);

    ctx.body = this.paginationBody({
      data: data,
      page: pageInt,
      perPage: perPageInt,
    });
  };

  delete = async (ctx: RouterContext, next: Koa.Next) => {
    const chatId = ctx.params.id;
    const chatIdInt = parseInt(chatId);
    const userId = ctx.user.id;

    await this.chatService.delete(chatIdInt, userId);

    ctx.body = {};
  };
}

export default ChatController;
