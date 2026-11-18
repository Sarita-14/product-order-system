import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const prefix = config.getOrThrow<string>('API_PREFIX');
  const port = config.getOrThrow<number>('PORT');

  app.setGlobalPrefix(prefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product & Order Management API')
    .setDescription('Products, orders with atomic stock deduction, and Resend order emails')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(`${prefix}/docs`, app, () => SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(port);
  Logger.log(`API:     http://localhost:${port}/${prefix}`, 'Bootstrap');
  Logger.log(`Swagger: http://localhost:${port}/${prefix}/docs`, 'Bootstrap');
}
void bootstrap();