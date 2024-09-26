import {RouterContext} from '@koa/router';
import jwt from 'jsonwebtoken';
import Koa from 'koa';
import ApiError from 'errors/ApiError';
import {Socket} from 'socket.io';

export const AuthMiddleware = async (ctx: RouterContext, next: Koa.Next) => {
  try {
    ctx.user = checkAuthorization(ctx.request.headers.authorization);
  } catch (e) {
    ctx.throw(e);
  }

  return await next();
};

export const SocketAuthMiddleware = (
  socket: Socket,
  next: (error?: Error) => void,
) => {
  try {
    socket.data.user = checkAuthorization(socket.request.headers.authorization);
  } catch (e) {
    return next(e);
  }

  next();
};

const checkAuthorization = (auth: string) => {
  try {
    const token = auth.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized();
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (e) {
    throw ApiError.unauthorized();
  }
};
