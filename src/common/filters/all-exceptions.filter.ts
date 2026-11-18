import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

/** Postgres error codes we translate into client-friendly HTTP errors. */
const PG_ERRORS: Record<string, { status: HttpStatus; message: string }> = {
  '23505': { status: HttpStatus.CONFLICT, message: 'Resource already exists' },
  '23503': { status: HttpStatus.CONFLICT, message: 'Resource is referenced by other records' },
  '23514': { status: HttpStatus.BAD_REQUEST, message: 'Value violates a data constraint' },
};

/**
 * Last line of defence: every error thrown anywhere in the request pipeline
 * ends up here and is returned in the same JSON shape.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const { status, message, errors } = this.resolve(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${req.method} ${req.originalUrl}`, (exception as Error)?.stack);
    } else {
      this.logger.warn(`${req.method} ${req.originalUrl} ${status} - ${message}`);
    }

    const body: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message,
      ...(errors && { errors }),
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    };
    res.status(status).json(body);
  }

  private resolve(exception: unknown): { status: number; message: string; errors?: string[] } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const raw = typeof response === 'string' ? response : (response as { message?: unknown }).message;

      // ValidationPipe returns an array of messages
      if (Array.isArray(raw)) {
        return { status: exception.getStatus(), message: 'Validation failed', errors: raw };
      }
      return { status: exception.getStatus(), message: String(raw ?? exception.message) };
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception.driverError as { code?: string })?.code ?? '';
      const known = PG_ERRORS[code];
      if (known) return { status: known.status, message: known.message };
    }

    // Never leak internal error details to the client
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
  }
}