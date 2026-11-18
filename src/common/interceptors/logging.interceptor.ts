import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

/** Logs method, URL, client IP, status and duration for each successful request. */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const { method, originalUrl, ip } = http.getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = http.getResponse<Response>();
        this.logger.log(`${method} ${originalUrl} ${statusCode} ${Date.now() - start}ms - ${ip}`);
      }),
    );
  }
}