import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const port = Number(config.getOrThrow<string>('PORT'));
  const prefix = config.getOrThrow<string>('API_PREFIX');
  const rootPath = config.getOrThrow<string>('API_ROOT_PATH');
  const swaggerPath = config.getOrThrow<string>('SWAGGER_PATH');

  app.setGlobalPrefix(prefix, {
    exclude: [
      { path: rootPath, method: RequestMethod.GET },
    ],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product & Order Management API')
    .setDescription(
      'Products, orders with atomic stock deduction, and Resend order emails',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    `${prefix}/${swaggerPath}`,
    app,
    document,
  );

  await app.listen(port);

  Logger.log(`Application running on port ${port}`, 'Bootstrap');
}

void bootstrap();
