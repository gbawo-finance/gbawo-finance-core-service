import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SecurityConfig {
  helmet: {
    contentSecurityPolicy: boolean;
    hsts: boolean;
    frameguard: boolean;
    hidePoweredBy: boolean;
    noSniff: boolean;
    xssFilter: boolean;
  };
  cors: {
    allowedOrigins: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
    maxAge: number;
  };
  validation: {
    maxRequestSize: number;
    enableSanitization: boolean;
    strictValidation: boolean;
  };
  monitoring: {
    logLevel: 'verbose' | 'debug' | 'log' | 'warn' | 'error';
    maxEventsInMemory: number;
    enableSecurityHeaders: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
}

@Injectable()
export class SecurityConfigService {
  private readonly config: SecurityConfig;

  constructor(private configService: ConfigService) {
    this.config = this.buildSecurityConfig();
  }

  getSecurityConfig(): SecurityConfig {
    return this.config;
  }

  private buildSecurityConfig(): SecurityConfig {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const isDevelopment = nodeEnv === 'development';

    return {
      helmet: {
        contentSecurityPolicy: true,
        hsts: false, // Disabled as requested (no HTTPS requirement)
        frameguard: true,
        hidePoweredBy: true,
        noSniff: true,
        xssFilter: true,
      },
      cors: {
        allowedOrigins: this.getAllowedOrigins(),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type', 
          'Authorization', 
          'X-Requested-With',
          'Accept',
          'Origin',
          'Cache-Control',
          'X-File-Name'
        ],
        maxAge: 86400, // 24 hours
      },
      validation: {
        maxRequestSize: this.configService.get<number>('MAX_REQUEST_SIZE', 10 * 1024 * 1024), // 10MB
        enableSanitization: true,
        strictValidation: isProduction,
      },
      monitoring: {
        logLevel: isDevelopment ? 'verbose' : 'log',
        maxEventsInMemory: this.configService.get<number>('MAX_SECURITY_EVENTS', 1000),
        enableSecurityHeaders: true,
      },
      rateLimit: {
        windowMs: this.configService.get<number>('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
        max: this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS', 1000), // Higher limit for internal service
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
      },
    };
  }

  private getAllowedOrigins(): string[] {
    const customOrigins = this.configService.get<string>('CORS_ALLOWED_ORIGINS', '');
    const baseOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080', // Adminer
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:8080',
    ];

    if (customOrigins) {
      const customOriginsList = customOrigins.split(',').map(origin => origin.trim());
      return [...baseOrigins, ...customOriginsList];
    }

    return baseOrigins;
  }

  /**
   * Get Content Security Policy configuration
   */
  getCSPConfig() {
    return {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Swagger UI
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for Swagger UI
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    };
  }

  /**
   * Get request size limits
   */
  getRequestLimits() {
    return {
      json: { limit: '10mb' },
      urlencoded: { limit: '10mb', extended: true },
      text: { limit: '10mb' },
    };
  }

  /**
   * Check if IP should be monitored more strictly
   */
  shouldMonitorIP(ip: string): boolean {
    // Monitor external IPs more strictly
    const internalRanges = [
      /^127\./, // Loopback
      /^10\./, // Class A private
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
      /^192\.168\./, // Class C private
      /^::1$/, // IPv6 loopback
      /^fc00:/, // IPv6 private
      /^fe80:/, // IPv6 link-local
    ];

    return !internalRanges.some(range => range.test(ip));
  }

  /**
   * Get security headers configuration
   */
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Download-Options': 'noopen',
      'X-DNS-Prefetch-Control': 'off',
    };
  }
} 