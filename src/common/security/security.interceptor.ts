import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecurityService } from './security.service';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  constructor(private readonly securityService: SecurityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const startTime = Date.now();

    // Skip security validation for health endpoints
    if (request.path?.startsWith('/health')) {
      return next.handle();
    }

    // Validate request headers
    const headerValidation = this.securityService.validateRequestHeaders(
      request.headers,
    );
    if (!headerValidation.isValid) {
      this.securityService.logSecurityEvent(
        'SECURITY_THREAT_DETECTED',
        {
          ip: request.ip,
          path: request.path,
          method: request.method,
          threats: headerValidation.threats,
          userAgent: request.headers['user-agent'],
        },
        'high',
      );

      throw new BadRequestException('Invalid request headers detected');
    }

    // Check for suspicious request patterns
    this.validateRequestPattern(request);

    // Log request for monitoring
    this.securityService.logSecurityEvent(
      'REQUEST_RECEIVED',
      {
        ip: request.ip,
        path: request.path,
        method: request.method,
        userAgent: request.headers['user-agent'],
        contentLength: request.headers['content-length'],
      },
      'low',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;

          // Log successful requests
          this.securityService.logSecurityEvent(
            'REQUEST_COMPLETED',
            {
              ip: request.ip,
              path: request.path,
              method: request.method,
              responseTime,
              status: 'success',
            },
            'low',
          );
        },
        error: (error: unknown) => {
          const responseTime = Date.now() - startTime;

          // Safely extract error message and status
          let errorMessage = 'Unknown error';
          let errorStatus = 500;
          if (typeof error === 'object' && error !== null) {
            if (
              'message' in error &&
              typeof (error as { message?: unknown }).message === 'string'
            ) {
              errorMessage = (error as { message: string }).message;
            }
            if (
              'status' in error &&
              typeof (error as { status?: unknown }).status === 'number'
            ) {
              errorStatus = (error as { status: number }).status;
            }
          }

          // Log failed requests
          this.securityService.logSecurityEvent(
            'REQUEST_FAILED',
            {
              ip: request.ip,
              path: request.path,
              method: request.method,
              responseTime,
              error: errorMessage,
              status: errorStatus,
            },
            'medium',
          );
        },
      }),
    );
  }

  private validateRequestPattern(request: Request): void {
    // Check request size
    const contentLength = parseInt(
      request.headers['content-length'] || '0',
      10,
    );
    if (contentLength > 10 * 1024 * 1024) {
      // 10MB limit
      this.securityService.logSecurityEvent(
        'OVERSIZED_REQUEST',
        {
          ip: request.ip,
          path: request.path,
          contentLength,
        },
        'medium',
      );
      throw new BadRequestException('Request too large');
    }

    // Check for suspicious paths
    const suspiciousPatterns = [
      /\.\.\//, // Path traversal
      /\/etc\/passwd/, // Linux system files
      /\/proc\//, // Linux proc directory
      /\/admin\//, // Admin paths (if not expected)
      /\/wp-admin\//, // WordPress admin
      /\/phpmyadmin\//, // PhpMyAdmin
      /\.(php|asp|jsp)$/i, // Script files (if not expected)
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(request.path))) {
      this.securityService.logSecurityEvent(
        'SUSPICIOUS_PATH_ACCESS',
        {
          ip: request.ip,
          path: request.path,
          method: request.method,
          userAgent: request.headers['user-agent'],
        },
        'high',
      );
    }

    // Check for SQL injection patterns in query parameters
    if (request.query) {
      const queryString = JSON.stringify(request.query);
      const sqlPatterns = [
        /union.*select/i,
        /drop.*table/i,
        /insert.*into/i,
        /delete.*from/i,
        /update.*set/i,
        /exec\(/i,
        /script>/i,
      ];

      sqlPatterns.forEach((pattern) => {
        if (pattern.test(queryString)) {
          this.securityService.logSecurityEvent(
            'SQL_INJECTION_ATTEMPT',
            {
              ip: request.ip,
              path: request.path,
              query: request.query,
              userAgent: request.headers['user-agent'],
            },
            'critical',
          );
          throw new BadRequestException('Invalid request parameters');
        }
      });
    }

    // Rate limiting check (basic implementation)
    const clientIP = request.ip || '127.0.0.1';
    if (!this.securityService.isInternalIP(clientIP)) {
      // For external IPs, we might want to implement stricter controls
      this.securityService.logSecurityEvent(
        'EXTERNAL_IP_ACCESS',
        {
          ip: clientIP,
          path: request.path,
          method: request.method,
        },
        'medium',
      );
    }
  }
}
