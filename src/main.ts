import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function application() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Note: Multipart handling will be done in controller using @UseInterceptors
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static('./uploads'));
  
  const options = new DocumentBuilder()
    .setTitle(`${process.env.APP_NAME} API Document`)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, options, {});

  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Request-ID']
  });
  app.setGlobalPrefix('api');


  const port = process.env.PORT || 3535;
  await app
    .listen(port, '0.0.0.0')
    .then(async () => {
      const logger = new Logger('Application');
      logger.debug(`App listen port: ${port}`);
    });
}

(async () => {
  await application();
})();
