import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import cookieParser from 'cookie-parser';

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
  app.use(cookieParser());

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
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: `${process.env.IDP_WEB_URL}/authorize?prompt=consent`,
          tokenUrl: `${process.env.IDP_URL}/oauth/token`,
          scopes: {
            openid: 'openid',
            profile: 'profile',
            offline_access: 'offline_access',
          },
        },
      },
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: `${process.env.IDP_CALLBACK_URL}`,
      persistAuthorization: true,
      displayRequestDuration: true,
      initOAuth: {
        clientId: process.env.IDP_CLIENT_ID,
        clientSecret: process.env.IDP_CLIENT_SECRET,
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
