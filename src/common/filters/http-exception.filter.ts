import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorData: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message =
          responseObj.message || responseObj.error || 'An error occurred';
        errorData = responseObj;
      }
    } else {
      // Handle non-HTTP exceptions
      message = exception.message || 'Internal server error';
      errorData =
        process.env.NODE_ENV === 'development' ? exception.stack : null;
    }

    const errorResponse = ApiResponseDto.error(message, errorData);

    response.status(status).json(errorResponse);
  }
}
