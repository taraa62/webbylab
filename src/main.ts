import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

let app: INestApplication;

export const bootstrap = async () => {
  app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        strategy: 'exposeAll',
        enableImplicitConversion: true,
      },
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('WebbyLab')
    .setVersion('1.1')
    .addTag('WebbyLab API description')
    .addBearerAuth({ type: 'http' }, 'Authorization')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get('ConfigService');
  const port = configService ? configService.get('PORT') : 8080;

  await app
    .listen(port)
    .then(() => {
      console.log('server up on ' + port);
    })
    .catch((er) => {
      console.error(er);
    });
};

export const stopServer = (): Promise<void> => {
  if (app) return app.close();
};

if (process.env.NODE_ENV !== 'test') bootstrap();
