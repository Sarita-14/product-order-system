// FIRST: run in UTC, so dates from the database are read correctly (see the file).
import './config/timezone';
import { Logger, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true = also keep the request body's exact original bytes (req.rawBody).
  // The Razorpay webhook needs them: its signature is computed over those exact bytes.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('PORT');
  const prefix = config.getOrThrow<string>('API_PREFIX');
  const host = config.getOrThrow<string>('APP_HOST');
  const swaggerPath = config.getOrThrow<string>('SWAGGER_PATH');

  // Lets the Next.js app (a different port = different origin) call the API from the browser
  app.enableCors({ origin: config.getOrThrow<string>('FRONTEND_URL') });

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
    .addBearerAuth() // adds the "Authorize" button: paste the accessToken from /auth/login
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