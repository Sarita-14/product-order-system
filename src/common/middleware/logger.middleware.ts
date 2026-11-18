import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Step 1 of the request flow: runs before guards, pipes and controllers.
 * Logs every request once it finishes - successes AND errors - with
 * method, URL, status code, duration and client IP.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    // 'finish' fires after the response is sent, so the final status code is known
    res.on('finish', () => {
      const message = `${method} ${originalUrl} ${res.statusCode} ${Date.now() - start}ms - ${ip}`;

      if (res.statusCode >= 500) this.logger.error(message);
      else if (res.statusCode >= 400) this.logger.warn(message);
      else this.logger.log(message);
    });

    next();
  }
}