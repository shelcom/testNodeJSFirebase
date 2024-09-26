import createSwaggerMiddleware from 'middleware/swaggerMiddleware';
import Koa from 'koa';
import path from 'path';

const configure = (app: Koa) => {
  createSwaggerMiddleware(app, {
    title: 'The Service',
    version: '1.0.0',
    parseOnRequest: false,
    apis: [path.join(process.cwd(), '/src/routers/*.ts')],
  });
};

export default configure;
