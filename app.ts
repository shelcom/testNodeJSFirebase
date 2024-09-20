import './src/crons';
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import {ErrorHandlingMiddleware} from './src/middleware';
import Router from '@koa/router';
import routers from './src/routers';
import imageRouter from './src/routers/imageRouter';
import staticRouter from './src/routers/staticRouter';
import {SocketServer} from 'sockets';
import {createServer} from 'http';
import {container} from 'tsyringe';
import StripeService from 'services/stripeService';
import swagger from 'configs/swagger';

const app = new Koa();
const httpServer = createServer(app.callback());
const socketServerInstance = container.resolve(SocketServer);
socketServerInstance.configure(httpServer);
const router = new Router();

router.use(staticRouter.routes());
router.use('/api', routers.routes());
router.use(imageRouter.routes());

app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(ErrorHandlingMiddleware);
app.use(router.routes()).use(router.allowedMethods());

swagger(app);

export const listen = (port: string) => {
  httpServer.listen(port, () => {
    console.log('server has been started on port ' + port);
    new StripeService();
  });
};
