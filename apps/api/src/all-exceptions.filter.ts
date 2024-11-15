import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log(`[INTERNAL_EXCEPTION] ${JSON.stringify(exception)}`);
    }

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : {};

    let error: any =
      exception instanceof HttpException
        ? typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse
        : { message: 'Internal server error' };

    delete error.error;

    if (Array.isArray(error.message)) {
      error.message = error.message.join(', ');
    }

    response.status(status).json({
      ...error,
      isError: true,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
