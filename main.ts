import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import helmet from 'helmet';
import knex from 'knex';
import {Model} from 'objection';

import knexConfig from './src/infrastructure/database/knex.config';
import {AppModule} from './src/app.module';
import {APP_PORT, environment} from './src/common/constants/constants';
import {MainErrorExceptionFilter} from './src/common/errors/mainErrorExceptionFilter';
import {generateDocument} from './generateSwaggerDocument';
import {LoggerService} from './src/common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = new LoggerService();

  // Log an informational message
  logger.log('Application is starting...');

  // Log a warning
  logger.warn('This is a warning message.');

  // add to url api
  app.setGlobalPrefix('api');

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strip out properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if any non-whitelisted properties are found
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Set up global filters
  app.useGlobalFilters(new MainErrorExceptionFilter());

  // Enable CORS
  app.enableCors();

  //Use Helmet
  app.use(helmet());

  // Add PG DB
  const environment = 'production';
  const connection = knex(knexConfig[environment]);
  Model.knex(connection);

  // Swagger configuration
  generateDocument(app);

  if (process.env.NODE_ENV !== 'test') {
    app.enableShutdownHooks();
  }

  // Start the application
  await app.listen(APP_PORT, '0.0.0.0', () => {
    logger.log(`Server has been started on port ${APP_PORT}`);
  });
}

bootstrap();
