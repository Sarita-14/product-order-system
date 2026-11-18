import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggerMiddleware } from './middleware/logger.middleware';

/**
 * Registers the global request pipeline:
 *
 * Request:  LoggerMiddleware -> ValidationPipe -> Controller -> Service
 * Response: TransformInterceptor (success) or AllExceptionsFilter (error)
 *           -> LoggerMiddleware logs the final status and duration
 */
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip properties not in the DTO
        forbidNonWhitelisted: true, // ...and reject the request if any were sent
        transform: true, // turn plain JSON into DTO class instances
      }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}