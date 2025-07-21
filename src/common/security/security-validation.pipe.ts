import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { SecurityService } from './security.service';

@Injectable()
export class SecurityValidationPipe extends ValidationPipe {
  constructor(private securityService: SecurityService) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints || {};
          return {
            property: error.property,
            value: error.value as unknown,
            constraints: Object.values(constraints),
          };
        });

        // Log validation failures for security monitoring
        this.securityService.logSecurityEvent(
          'VALIDATION_FAILED',
          {
            errors: messages,
            timestamp: new Date().toISOString(),
          },
          'medium',
        );

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    });
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // Sanitize input before validation
    if (value && typeof value === 'object') {
      value = this.securityService.sanitizeInput(value) as Record<
        string,
        unknown
      >;
    }

    // Check for common security threats in the input
    this.validateForSecurityThreats(value, metadata);

    // Apply parent validation
    return super.transform(value, metadata);
  }

  private validateForSecurityThreats(
    value: any,
    metadata: ArgumentMetadata,
  ): void {
    if (!value || typeof value !== 'object') return;

    const valueString = JSON.stringify(value);

    // Check for potential injection attacks
    const dangerousPatterns = [
      /<script.*?>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /union.*select/gi,
      /drop.*table/gi,
      /insert.*into/gi,
      /delete.*from/gi,
      /update.*set/gi,
      /exec\s*\(/gi,
      /eval\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
    ];

    dangerousPatterns.forEach((pattern) => {
      if (pattern.test(valueString)) {
        this.securityService.logSecurityEvent(
          'MALICIOUS_INPUT_DETECTED',
          {
            pattern: pattern.source,
            input: value as unknown,
            metadata: metadata.type,
            timestamp: new Date().toISOString(),
          },
          'critical',
        );

        throw new BadRequestException('Invalid input detected');
      }
    });

    // Check for prototype pollution attempts
    if (this.hasPrototypePollution(value)) {
      this.securityService.logSecurityEvent(
        'PROTOTYPE_POLLUTION_ATTEMPT',
        {
          input: value as unknown,
          metadata: metadata.type,
          timestamp: new Date().toISOString(),
        },
        'critical',
      );

      throw new BadRequestException('Invalid object structure');
    }
  }

  private hasPrototypePollution(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    return this.checkKeysRecursively(obj, dangerousKeys);
  }

  private checkKeysRecursively(obj: any, dangerousKeys: string[]): boolean {
    if (!obj || typeof obj !== 'object') return false;

    for (const key of Object.keys(obj as Record<string, unknown>)) {
      if (dangerousKeys.includes(key)) {
        return true;
      }

      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        typeof (obj as Record<string, unknown>)[key] === 'object' &&
        (obj as Record<string, unknown>)[key] !== null
      ) {
        if (
          this.checkKeysRecursively(
            (obj as Record<string, unknown>)[key],
            dangerousKeys,
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }
}
