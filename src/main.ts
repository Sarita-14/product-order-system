import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Global validation with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out unexpected fields
      forbidNonWhitelisted: true, // Reject payloads with undefined fields
      transform: true, // Auto-cast types based on DTO metadata
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Interceptors & Filters
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Product & Order Management API')
    .setDescription(
      'NestJS REST API for Product Inventory, Orders, Stock Transactions, and Resend Email receipts',
    )
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'x-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Swagger documentation at: http://localhost:${port}/api/docs`);
}
bootstrap();