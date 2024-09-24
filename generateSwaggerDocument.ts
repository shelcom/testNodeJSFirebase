import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common';

import * as packageConfig from './package.json';

export const generateDocument = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
