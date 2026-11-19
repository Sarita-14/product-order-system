import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('PORT');
  const prefix = config.getOrThrow<string>('API_PREFIX');
  const host = config.getOrThrow<string>('APP_HOST');
  const swaggerPath = config.getOrThrow<string>('SWAGGER_PATH');

  // every route gets the prefix, except the root health check
  app.setGlobalPrefix(prefix, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product & Order Management API')
    .setDescription(
      'Products, orders with atomic stock deduction, and Resend order emails',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(swaggerPath, app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(port);
  const appUrl = `http://${host}:${port}`;
  Logger.log(`App:     ${appUrl}`, 'Bootstrap');
  Logger.log(`Swagger: ${appUrl}/${swaggerPath}`, 'Bootstrap');
}
void bootstrap();
