import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {FastifyReply, FastifyRequest} from 'fastify';

import {ApiError} from '@common/errors/apiErrors';
import {LoggerService} from '@common/logger/logger.service';

@Catch()
export class MainErrorExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let logger: LoggerService = new LoggerService();

    let status: number;
    let message: string;
    let errors: any[] = [];

    if (exception instanceof ApiError) {
      // Custom ApiError handling
      status = exception.status;
      message = exception.message;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      // NestJS built-in HttpException handling
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof (exceptionResponse as any).message === 'string') {
        message = (exceptionResponse as any).message;
        errors = (exceptionResponse as any).errors || [];
      } else {
        message = 'Unexpected error occurred';
      }
    } else {
      // Handling unexpected exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    };

    logger.error('Error response:', errorResponse);

    response.status(status).send(errorResponse);
  }
}
