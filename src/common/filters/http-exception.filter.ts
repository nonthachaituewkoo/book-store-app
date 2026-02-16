import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP_ERROR');
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const LogMessage = {
      status,
      method: request.method,
      path: request.url,
      message: exception.message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(LogMessage),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      mthod: request.method,
      message: (exceptionResponse as any).message || exception.message,
      error: (exceptionResponse as any).error || 'Internal Server Error',
    });
  }
}
