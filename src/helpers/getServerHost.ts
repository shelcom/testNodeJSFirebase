import {RouterContext} from '@koa/router';

export const getServerHost = (ctx: RouterContext) => {
  return ctx.protocol + '://' + ctx.request.header.host + '/';
};
