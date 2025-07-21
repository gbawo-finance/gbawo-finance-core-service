import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';
import { SecurityService } from '../security/security.service';

@Catch()
export class SecurityExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SecurityExceptionFilter.name);

  constructor(private securityService: SecurityService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Skip filter for health endpoints to preserve their original format
    if (request.url.startsWith('/health')) {
      if (exception instanceof HttpException) {
        response.status(exception.getStatus()).json(exception.getResponse());
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        });
      }
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorData: any = null;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message =
          responseObj.message || responseObj.error || 'An error occurred';
        errorData = this.sanitizeErrorData(responseObj);
      }

      // Determine severity based on status code
      if (status >= 500) {
        severity = 'high';
      } else if (status === 401 || status === 403) {
        severity = 'high'; // Security-related
      } else if (status >= 400) {
        severity = 'medium';
      } else {
        severity = 'low';
      }
    } else {
      // Handle non-HTTP exceptions
      severity = 'critical';
      message = 'Internal server error'; // Don't expose internal error details

      // Log the actual error internally
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );

      // Only include error details in development
      if (process.env.NODE_ENV === 'development') {
        errorData = {
          message: exception.message,
          stack: exception.stack,
        };
      }
    }

    // Log security event
    this.securityService.logSecurityEvent(
      'EXCEPTION_OCCURRED',
      {
        ip: request.ip,
        path: request.path,
        method: request.method,
        statusCode: status,
        errorType: exception.constructor.name,
        userAgent: request.headers['user-agent'],
        timestamp: new Date().toISOString(),
      },
      severity,
    );

    // Check for potential security attacks based on error patterns
    this.detectSecurityAttacks(exception, request);

    const errorResponse = ApiResponseDto.error(message, errorData);

    response.status(status).json(errorResponse);
  }

  private sanitizeErrorData(errorData: any): any {
    if (!errorData || typeof errorData !== 'object') {
      return errorData;
    }

    // Remove sensitive information from error responses
    const sanitized = { ...errorData };
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'cookie',
      'session',
      'auth',
      'credential',
      'private',
    ];

    const sanitizeRecursive = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};

      Object.keys(obj).forEach((key) => {
        const lowerKey = key.toLowerCase();

        if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          result[key] = sanitizeRecursive(obj[key]);
        } else {
          result[key] = obj[key];
        }
      });

      return result;
    };

    return sanitizeRecursive(sanitized);
  }

  private detectSecurityAttacks(exception: any, request: Request): void {
    const errorMessage = exception.message?.toLowerCase() || '';
    const path = request.path;
    const userAgent = request.headers['user-agent'] || '';

    // Detect potential SQL injection attempts
    if (errorMessage.includes('sql') || errorMessage.includes('database')) {
      this.securityService.logSecurityEvent(
        'POTENTIAL_SQL_INJECTION',
        {
          ip: request.ip,
          path,
          error: exception.message,
          userAgent,
          query: request.query,
          body: request.body,
        },
        'critical',
      );
    }

    // Detect path traversal attempts
    if (
      errorMessage.includes('no such file') ||
      errorMessage.includes('cannot read')
    ) {
      if (path.includes('..') || path.includes('%2e%2e')) {
        this.securityService.logSecurityEvent(
          'PATH_TRAVERSAL_ATTEMPT',
          {
            ip: request.ip,
            path,
            error: exception.message,
            userAgent,
          },
          'high',
        );
      }
    }

    // Detect potential XSS attempts
    if (
      errorMessage.includes('script') ||
      errorMessage.includes('javascript')
    ) {
      this.securityService.logSecurityEvent(
        'POTENTIAL_XSS_ATTEMPT',
        {
          ip: request.ip,
          path,
          error: exception.message,
          userAgent,
          body: request.body,
        },
        'high',
      );
    }

    // Detect brute force patterns
    if (exception.status === 401 || exception.status === 403) {
      this.securityService.logSecurityEvent(
        'AUTHENTICATION_FAILURE',
        {
          ip: request.ip,
          path,
          userAgent,
          statusCode: exception.status,
        },
        'medium',
      );
    }
  }
}
