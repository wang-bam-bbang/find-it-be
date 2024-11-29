import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    ['/api/docs'], // Swagger 경로
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_ID]: process.env.SWAGGER_PW,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fint-it API')
    .setDescription(
      'Backend API for Find-it\n[GitHub](https://github.com/wang-bam-bbang/find-it-be)',
    )
    .setVersion('1.0')
    .addTag('Fint-it')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
