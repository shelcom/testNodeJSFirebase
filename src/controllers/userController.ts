import {RouterContext} from '@koa/router';
import Koa from 'koa';
import UserService from 'services/userService';
import {singleton} from 'tsyringe';
import strings from 'strings';
import {getServerHost} from 'helpers/getServerHost';

interface UserModel {
  email: string;
  password?: string;
  role?: string;
}

interface RegistrationPasskeysOptionsModel {
  id: string;
  rawId: string;
  type: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
  };
}

interface TokenAndPassword {
  token?: string;
  refreshToken?: string;
  newPassword?: string;
  password?: string;
}

interface LoginPasskeysOptionsModel {
  email: string;
  id: string;
  rawId: string;
  type: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
}

@singleton()
class UserController {
  constructor(private userService: UserService) {}

  registration = async (ctx: RouterContext, next: Koa.Next) => {
    const {email, password, role} = ctx.request.body as UserModel;
    const data = await this.userService.registration(email, password, role);

    ctx.status = 201;
    ctx.body = {data};
  };

  registrationPasskeysInitialize = async (ctx: RouterContext) => {
    const {email, role} = ctx.request.body as UserModel;
    const data = await this.userService.registrationPasskeysInitialize(
      email,
      role,
    );

    ctx.status = 201;
    ctx.body = {data};
  };

  registrationPasskeysFinalize = async (ctx: RouterContext) => {
    const {id} = ctx.params;
    const idInt = parseInt(id);
    const {...registrationOptions} = ctx.request
      .body as RegistrationPasskeysOptionsModel;

    const data = await this.userService.registrationPasskeysFinalize(
      idInt,
      registrationOptions,
    );
    ctx.body = {data};
  };

  loginPasskeysInitialize = async (ctx: RouterContext) => {
    const {email} = ctx.request.body as UserModel;
    const data = await this.userService.loginPasskeysInitialize(email);

    ctx.body = {
      data,
    };
  };

  loginPasskeysFinalize = async (ctx: RouterContext) => {
    const {...loginOptions} = ctx.request.body as LoginPasskeysOptionsModel;
    console.log(loginOptions);

    const data = await this.userService.loginPasskeysFinalize(loginOptions);
    ctx.body = {data};
  };

  login = async (ctx: RouterContext, next: Koa.Next) => {
    const {email, password} = ctx.request.body as UserModel;
    const data = await this.userService.login(email, password);
    ctx.body = {data};
  };

  logout = async (ctx: RouterContext, next: Koa.Next) => {
    const user = ctx.user;
    await this.userService.logout(user);
    ctx.body = {};
  };

  refresh = async (ctx: RouterContext, next: Koa.Next) => {
    const {refreshToken} = ctx.request.body as TokenAndPassword;
    const data = await this.userService.refresh(refreshToken);
    ctx.body = {data};
  };

  forgetPassword = async (ctx: RouterContext, next: Koa.Next) => {
    const {email} = ctx.request.body as UserModel;
    const baseLink = getServerHost(ctx);
    await this.userService.forgetPassword(baseLink, email);
    ctx.body = {
      data: {
        message: strings.mail.emailHasBeenSent,
      },
    };
  };

  recoverPassword = async (ctx: RouterContext, next: Koa.Next) => {
    const {token, password} = ctx.request.body as TokenAndPassword;
    await this.userService.recoverPassword(token, password);
    ctx.body = {};
  };
}

export default UserController;
