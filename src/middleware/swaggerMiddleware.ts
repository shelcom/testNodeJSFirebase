import {koaSwagger} from 'koa2-swagger-ui';
import swaggerJSDoc from 'swagger-jsdoc';

function createSwaggerMiddleware(app, {version, title, parseOnRequest, apis}) {
  const swaggerJsonPath = '/swagger.json';

  let swaggerSpec;

  app.use((ctx, next) => {
    if (ctx.path === '/api' + swaggerJsonPath) {
      if (!swaggerSpec || parseOnRequest) {
        // openapi 3.0
        swaggerSpec = swaggerJSDoc({
          apis,
          definition: {
            openapi: '3.0.0',
            info: {
              title,
              version,
            },
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              },
            },
            security: [
              {
                bearerAuth: [],
              },
            ],
            servers: [
              {
                url: `${process.env.SWAGGER_API_URL}${swaggerJsonPath}`, // JSON endpoint,
              },
            ],
          },
        });
      }

      ctx.body = swaggerSpec;
      return;
    }

    return next();
  });

  app.use(
    // @ts-ignore
    koaSwagger({
      title,
      swaggerVersion: '3.30.2',
      routePrefix: '/api/swagger',
      swaggerOptions: {
        url: `${process.env.SWAGGER_API_URL}${swaggerJsonPath}`,
        showRequestHeaders: true,
      },
      hideTopbar: true,
    }),
  );
}

export default createSwaggerMiddleware;
