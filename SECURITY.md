# Security Implementation

This document outlines the security measures implemented in the Gbawo Finance Core Service.

## 🛡️ Implemented Security Features

### 1. Security Headers (Helmet)
- **Content Security Policy (CSP)**: Prevents XSS attacks and code injection
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME sniffing attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer-Policy**: Controls referrer information sent to other sites
- **Hide X-Powered-By**: Removes Express.js fingerprinting

### 2. Input Validation & Sanitization
- **Enhanced Validation Pipeline**: Custom validation with security threat detection
- **Input Sanitization**: Automatic removal of malicious scripts and code
- **SQL Injection Prevention**: Pattern detection and blocking
- **XSS Protection**: Script tag and JavaScript protocol removal
- **Prototype Pollution Prevention**: Dangerous object keys detection
- **Request Size Limits**: 10MB default limit to prevent DoS attacks

### 3. CORS Configuration (Environment-Based)
- **Environment-Driven Origins**: CORS allowed origins configured via `CORS_ALLOWED_ORIGINS` environment variable
- **Default Internal Origins**: Falls back to localhost/127.0.0.1 on common ports if not configured
- **Dynamic Origin Checking**: Logs and blocks unauthorized origins with detailed information
- **Credentials Support**: Properly configured for internal service communication
- **Method Restrictions**: Only allows necessary HTTP methods

### 4. Security Monitoring & Logging
- **Comprehensive Security Event Logging**: All security events are logged with severity levels
- **Attack Pattern Detection**: Identifies potential SQL injection, XSS, and path traversal attempts
- **Request Monitoring**: Tracks all incoming requests with security metadata
- **IP-based Monitoring**: Enhanced monitoring for external IPs
- **Security Event History**: In-memory storage of recent security events

### 5. Error Handling & Information Disclosure Prevention
- **Sanitized Error Responses**: Removes sensitive information from error messages
- **Attack Detection via Errors**: Identifies security attacks through error patterns
- **Development vs Production**: Different error detail levels
- **Sensitive Data Redaction**: Automatic removal of passwords, tokens, and keys

### 6. Request Processing Security
- **Header Validation**: Checks for suspicious user agents and injection patterns
- **Path Validation**: Detects path traversal and suspicious path access
- **Request Pattern Analysis**: Identifies potentially malicious request patterns

### 7. Content Compression & Performance
- **Gzip Compression**: Reduces bandwidth usage and improves performance
- **Security-aware Compression**: Maintains security while optimizing performance

## 📊 Security Endpoints

### Security Monitoring Endpoints
- `GET /api/v1/security/events` - View recent security events
- `GET /api/v1/security/events/by-type` - Filter events by type
- `GET /api/v1/security/health` - Security system health check

## ⚙️ Configuration

### Environment Variables (Optional)
```env
# Database Configuration (Required)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=gbawo_finance
DB_DIALECT=postgres

# Application Configuration (Required)
PORT=3000
NODE_ENV=development

# Security Configuration (Optional)
# Comma-separated list of allowed CORS origins
# If not provided, defaults to localhost and 127.0.0.1 on ports 3000, 3001, 8080
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080,http://your-internal-service.local

# Maximum request size in bytes (default: 10MB = 10485760 bytes)
MAX_REQUEST_SIZE=10485760

# Maximum number of security events to keep in memory (default: 1000)
MAX_SECURITY_EVENTS=1000

# Rate Limiting (for future use)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Security Configuration Service
The application includes a centralized `SecurityConfigService` that manages:
- **Helmet configuration**: CSP, security headers, and protection settings
- **CORS settings**: Environment-based origin configuration with fallback defaults
- **Validation rules**: Request size limits, sanitization settings, and strict validation modes
- **Monitoring preferences**: Log levels, event storage limits, and security header controls
- **Rate limiting settings**: Window duration and request limits (ready for future implementation)

## 🔍 Security Event Types

The system logs various security events:

### Critical Events
- `MALICIOUS_INPUT_DETECTED` - Dangerous patterns in input data
- `PROTOTYPE_POLLUTION_ATTEMPT` - Attempt to pollute object prototypes
- `SQL_INJECTION_ATTEMPT` - Potential SQL injection attack
- `POTENTIAL_SQL_INJECTION` - SQL-related errors that might indicate attacks
- `SERVICE_STARTED` - Service startup with security configuration

### High Priority Events
- `SECURITY_THREAT_DETECTED` - General security threats in headers
- `SUSPICIOUS_PATH_ACCESS` - Access to suspicious file paths
- `HEADER_VALIDATION_FAILED` - Malicious headers detected
- `PATH_TRAVERSAL_ATTEMPT` - Directory traversal attempts
- `POTENTIAL_XSS_ATTEMPT` - Cross-site scripting attempts

### Medium Priority Events
- `CORS_VIOLATION` - Blocked CORS requests
- `VALIDATION_FAILED` - Input validation failures
- `OVERSIZED_REQUEST` - Requests exceeding size limits
- `EXTERNAL_IP_ACCESS` - Access from external IP addresses
- `REQUEST_FAILED` - Failed requests with error details
- `AUTHENTICATION_FAILURE` - Auth-related failures

### Low Priority Events
- `REQUEST_RECEIVED` - All incoming requests
- `REQUEST_COMPLETED` - Successfully processed requests

## 🏗️ Architecture

### Security Components
1. **SecurityService**: Core security functionality and event logging
2. **SecurityInterceptor**: Request/response security validation
3. **SecurityValidationPipe**: Enhanced input validation with threat detection
4. **SecurityExceptionFilter**: Secure error handling with attack detection
5. **SecurityController**: Security monitoring endpoints
6. **SecurityConfigService**: Centralized security configuration

### Security Flow
1. Request arrives → Helmet security headers applied
2. CORS validation → SecurityInterceptor validation
3. Input validation → SecurityValidationPipe processing
4. Business logic execution
5. Response → SecurityExceptionFilter (if errors)
6. Security event logging throughout the process

## 🎯 Internal Service Optimizations

Since this is an internal service, the security configuration includes:

- **No HTTPS Enforcement**: Suitable for internal network communication
- **Higher Rate Limits**: More permissive for internal service-to-service calls
- **Internal IP Recognition**: Different monitoring levels for internal vs external IPs
- **Development-friendly CSP**: Allows inline styles/scripts for Swagger UI
- **Comprehensive Logging**: Detailed security event logging for monitoring

## 🚀 Getting Started

The security measures are automatically enabled when you start the application:

```bash
npm run start:dev
```

Monitor security events at:
- Health Check: `http://localhost:3000/api/v1/security/health`
- Recent Events: `http://localhost:3000/api/v1/security/events`
- API Documentation: `http://localhost:3000/api/docs`

## 📈 Monitoring

Security events are logged to the console with appropriate severity levels:
- **Critical**: Immediate attention required
- **High**: Security concern that should be investigated
- **Medium**: Potential security issue
- **Low**: Normal operational security events

All events include timestamps, IP addresses, request details, and relevant metadata for security analysis.

## 🔄 Future Enhancements

The security foundation is in place for future enhancements:
- Rate limiting implementation (infrastructure ready)
- External SIEM integration
- Advanced threat detection
- Security metrics and dashboards
- Automated response systems 