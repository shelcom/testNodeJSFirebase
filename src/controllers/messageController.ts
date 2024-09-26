import {RouterContext} from '@koa/router';
import Koa from 'koa';
import {singleton} from 'tsyringe';
import BaseController from './baseController';
import MessageService from 'services/messageService';

@singleton()
class MessageController extends BaseController {
  constructor(private messageService: MessageService) {
    super();
  }

  getAll = async (ctx: RouterContext, next: Koa.Next) => {
    const userId = ctx.user.id;
    const {page, per_page} = ctx.query;
    const chatId = ctx.params.id;
    const chatIdInt = parseInt(chatId);
    const pageInt = parseInt(page as string);
    const perPageInt = parseInt(per_page as string);

    const data = await this.messageService.getAll(
      pageInt,
      perPageInt,
      userId,
      chatIdInt,
    );

    ctx.body = this.paginationBody({
      data: data,
      page: pageInt,
      perPage: perPageInt,
    });
  };
}

export default MessageController;
