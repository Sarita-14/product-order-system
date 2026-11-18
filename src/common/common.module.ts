import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/**
 * Registers the global request pipeline through DI (instead of main.ts),
 * so it also applies in e2e tests that build the app from AppModule.
 *
 * Request order:  interceptors (before) -> pipe -> controller -> service
 * Response order: interceptors (after), or the filter if anything threw.
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
    // registered in order: Logging wraps Transform
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class CommonModule {}
