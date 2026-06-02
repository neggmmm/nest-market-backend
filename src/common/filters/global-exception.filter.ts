import {ExceptionFilter, Catch,ArgumentsHost, HttpException, HttpStatus,} from '@nestjs/common';
import { Response } from 'express';
import { AppLogger } from '../logger/logger.service';

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An internal error occurred';

    // Log all errors with full details
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'object' &&'message' in exceptionResponse
          ? (exceptionResponse as any).message
          : exception.message;

      this.logger.warn('GlobalExceptionFilter', `HTTP Exception: ${message}`,
        {statusCode,url: request.url,method: request.method,});
    } else if (exception instanceof Error) {
      // For non-HTTP errors, always return 500 but log the details
      this.logger.error(
        'GlobalExceptionFilter',
        `Unhandled Exception: ${exception.message}`,
        exception
      );
      message = 'An internal error occurred'; // Safe message for client
    } else {
      this.logger.error('GlobalExceptionFilter','Unknown error occurred',exception);
      message = 'An internal error occurred'; // Safe message for client
    }

    const errorResponse: ErrorResponse = {statusCode,message,timestamp: new Date().toISOString(),};
    response.status(statusCode).json(errorResponse);
  }
}
