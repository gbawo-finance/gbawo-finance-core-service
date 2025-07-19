import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SecurityEvent {
  type: string;
  data: any;
  timestamp?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private securityEvents: SecurityEvent[] = [];
  private readonly maxEventsInMemory = 1000;

  constructor(private configService: ConfigService) {}

  /**
   * Log security events for monitoring and audit purposes
   */
  logSecurityEvent(type: string, data: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const event: SecurityEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
      severity,
    };

    // Add to in-memory storage (for recent events)
    this.securityEvents.push(event);
    
    // Maintain max events in memory
    if (this.securityEvents.length > this.maxEventsInMemory) {
      this.securityEvents.shift();
    }

    // Log based on severity
    const logMessage = `Security Event: ${type}`;
    const logData = { ...event, service: 'gbawo-finance-core' };

    switch (severity) {
      case 'critical':
        this.logger.error(logMessage, logData);
        break;
      case 'high':
        this.logger.warn(logMessage, logData);
        break;
      case 'medium':
        this.logger.log(logMessage, logData);
        break;
      case 'low':
        this.logger.verbose(logMessage, logData);
        break;
    }

    // In production, you might want to send to external monitoring system
    if (this.configService.get('NODE_ENV') === 'production' && severity === 'critical') {
      this.handleCriticalSecurityEvent(event);
    }
  }

  /**
   * Get recent security events
   */
  getRecentSecurityEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents.slice(-limit);
  }

  /**
   * Get security events by type
   */
  getSecurityEventsByType(type: string): SecurityEvent[] {
    return this.securityEvents.filter(event => event.type === type);
  }

  /**
   * Validate request headers for security threats
   */
  validateRequestHeaders(headers: Record<string, any>): { isValid: boolean; threats: string[] } {
    const threats: string[] = [];

    // Check for suspicious user agents
    const userAgent = headers['user-agent']?.toLowerCase() || '';
    const suspiciousPatterns = [
      'sqlmap', 'nikto', 'nessus', 'burp', 'zap', 'gobuster', 'dirb',
      'scanner', 'bot', 'crawler'
    ];

    if (suspiciousPatterns.some(pattern => userAgent.includes(pattern))) {
      threats.push('SUSPICIOUS_USER_AGENT');
    }

    // Check for injection patterns in headers
    const injectionPatterns = [
      /<script/i, /javascript:/i, /vbscript:/i, /onload=/i, /onerror=/i,
      /union.*select/i, /drop.*table/i, /insert.*into/i, /delete.*from/i,
      /\.\./g, // Path traversal
    ];

    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        injectionPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            threats.push(`INJECTION_ATTEMPT_IN_${key.toUpperCase()}`);
          }
        });
      }
    });

    // Check for oversized headers
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 8192) {
        threats.push('OVERSIZED_HEADER');
      }
    });

    if (threats.length > 0) {
      this.logSecurityEvent('HEADER_VALIDATION_FAILED', { threats, headers }, 'high');
    }

    return {
      isValid: threats.length === 0,
      threats
    };
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      Object.keys(input).forEach(key => {
        sanitized[key] = this.sanitizeInput(input[key]);
      });
      return sanitized;
    }

    return input;
  }

  /**
   * Check if IP is in allowed range (for internal services)
   */
  isInternalIP(ip: string): boolean {
    // Common internal IP ranges
    const internalRanges = [
      /^127\./, // Loopback
      /^10\./, // Class A private
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
      /^192\.168\./, // Class C private
      /^::1$/, // IPv6 loopback
      /^fc00:/, // IPv6 private
      /^fe80:/, // IPv6 link-local
    ];

    return internalRanges.some(range => range.test(ip));
  }

  private handleCriticalSecurityEvent(event: SecurityEvent): void {
    // In a real implementation, you might:
    // - Send alerts to security team
    // - Block suspicious IPs
    // - Trigger automated responses
    // - Send to SIEM system
    
    this.logger.error(`CRITICAL SECURITY EVENT: ${event.type}`, {
      event,
      action: 'ALERT_SENT',
      service: 'gbawo-finance-core'
    });
  }
} 