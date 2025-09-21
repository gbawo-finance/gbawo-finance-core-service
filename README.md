# Gbawo Finance Core Service

A comprehensive NestJS-based microservice for the Gbawo Finance platform, providing core financial services including user management, transaction processing, cryptocurrency and fiat currency operations, exchange rates, webhooks, and third-party integrator management.

## Features

- 🚀 **Modern Architecture**: Built with NestJS 11 and TypeScript 5.7
- 🗃️ **Database**: PostgreSQL with Sequelize ORM and TypeScript support
- 🛡️ **Advanced Security**: 
  - Helmet.js for security headers
  - Custom security interceptors and validation pipes
  - CORS protection with environment-based origin validation
  - Request sanitization and threat detection
  - Security event logging and monitoring
- 🏥 **Health Monitoring**: Comprehensive health checks with database connectivity verification
- 📚 **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- 🔧 **Configuration Management**: Environment-based configuration with validation
- ✅ **Data Validation**: Class-validator with custom security validation
- 🌐 **CORS**: Configurable CORS with security logging
- 📦 **Request Processing**: Compression, response interceptors, and global exception handling
- 🔒 **Input Sanitization**: MongoDB injection protection and request sanitization

## Core Modules

### Users Module
- User registration and profile management
- KYC (Know Your Customer) submission and status tracking
- Account number and wallet address reservation
- User listing with filtering capabilities

### Transactions Module
- Transaction processing and management
- Transaction history and status tracking
- Support for various transaction types

### Rates Module
- Real-time exchange rate calculations
- Multi-currency support
- Rate conversion services

### Fiat Module
- Fiat currency operations
- Traditional banking integrations
- Currency conversion and management

### Crypto Module
- Cryptocurrency operations
- Blockchain integrations
- Crypto wallet management

### Webhooks Module
- Webhook endpoint management
- Event notification system
- Third-party service integrations

### Integrators Module
- Third-party integrator management
- API key management and rotation
- Webhook configuration
- Rate limits and analytics
- Settlement and reconciliation reports

### Security Module
- Security event monitoring
- Threat detection and logging
- Request validation and filtering
- Security configuration management

## Prerequisites

- Node.js (v18+ recommended)
- Docker and Docker Compose (for development database)
- npm or yarn
- PostgreSQL (if not using Docker)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gbawo-finance-core-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=gbawo_finance
DB_DIALECT=postgres

# Security Configuration (Optional)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
MAX_REQUEST_SIZE=1048576
MAX_SECURITY_EVENTS=1000
```

4. Set up the database:

**Option A: Using Docker (Recommended for Development)**
```bash
# Start PostgreSQL with Docker
docker-compose up postgres -d

# Or start with Adminer (web database admin)
docker-compose up -d
```

**Option B: Using Local PostgreSQL**
```sql
CREATE DATABASE gbawo_finance;
```

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Development mode
npm run start

# Build the application
npm run build
```

The application will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

Once the application is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api/documentation`

The API documentation includes detailed information about all endpoints, request/response schemas, and authentication requirements.

## API Endpoints

### Health Checks
- `GET /health` - Comprehensive health check including database connectivity
- `GET /health/simple` - Simple health check with timestamp

### Core API Routes
All application routes are prefixed with `/api/v1/`:

#### Users (`/api/v1/users`)
- `GET /api/v1/users` - List users with optional filters
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get user profile
- `PATCH /api/v1/users/:id` - Update user profile
- `POST /api/v1/users/:id/kyc` - Submit KYC information
- `GET /api/v1/users/:id/kyc-status` - Get KYC status
- `POST /api/v1/users/:id/reserve-account` - Reserve account number
- `POST /api/v1/users/:id/reserve-wallet` - Reserve wallet address

#### Transactions (`/api/v1/transactions`)
- Transaction processing and management endpoints
- Transaction history and status tracking

#### Rates (`/api/v1/rates`)
- `GET /api/v1/rates` - Calculate exchange rates with query parameters

#### Fiat (`/api/v1/fiat`)
- Fiat currency operations and management

#### Crypto (`/api/v1/crypto`)
- Cryptocurrency operations and wallet management

#### Webhooks (`/api/v1/webhooks`)
- Webhook management and event processing

#### Integrators (`/api/v1/integrators`)
- `GET /api/v1/integrators` - List integrators
- `GET /api/v1/integrators/:id` - Get integrator profile
- `PUT /api/v1/integrators/:id` - Update integrator
- `GET /api/v1/integrators/:id/api-keys` - Get API keys
- `POST /api/v1/integrators/:id/api-keys/rotate` - Rotate API key
- `GET /api/v1/integrators/:id/webhooks` - Get webhook configuration
- `PUT /api/v1/integrators/:id/webhooks` - Update webhook configuration
- And more endpoints for analytics, limits, and reports

#### Security (`/api/v1/security`)
- Security monitoring and threat detection endpoints

## Database

The application uses Sequelize ORM with PostgreSQL, featuring:
- Auto-loading of TypeScript models
- Environment-based configuration
- Connection pooling and health monitoring
- Development mode synchronization
- Migration support

### Docker Development Database

For development convenience, we provide a Docker Compose setup with PostgreSQL and Adminer.

#### Quick Start
```bash
# Start database only
docker-compose up postgres -d

# Start database with Adminer web UI
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs postgres

# Stop services
docker-compose down

# Reset database (deletes all data)
docker-compose down -v
```

#### Services Included
- **PostgreSQL 15**: Main database (localhost:5432)
- **Adminer**: Web-based database admin (http://localhost:8080)

#### Database Access
- **Host**: localhost
- **Port**: 5432
- **Database**: gbawo_finance
- **Username**: postgres
- **Password**: password (from your .env file)

#### Adminer Access
Visit http://localhost:8080 when running the full stack:
- **System**: PostgreSQL
- **Server**: postgres
- **Username**: postgres
- **Password**: password
- **Database**: gbawo_finance

## Development

```bash
# Watch mode for development
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test

# Run test coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

# Lint and fix code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── common/
│   ├── decorators/          # Custom decorators (API responses)
│   ├── dto/                 # Data Transfer Objects for all modules
│   ├── encryption/          # AES-GCM encryption utilities
│   ├── enums/              # Application enums and constants
│   ├── filters/            # Exception filters (HTTP, Security)
│   ├── interceptors/       # Response interceptors
│   └── security/           # Security module (global)
├── config/
│   ├── database.config.ts   # Database configuration service
│   ├── env.validation.ts    # Environment validation schema
│   └── security.config.ts   # Security configuration service
├── users/                   # User management module
├── transactions/            # Transaction processing module
├── rates/                   # Exchange rates module
├── fiat/                    # Fiat currency operations module
├── crypto/                  # Cryptocurrency operations module
├── webhooks/                # Webhook management module
├── integrators/             # Third-party integrator management
├── health/                  # Health check endpoints
├── app.controller.ts        # Main app controller
├── app.module.ts           # Root application module
├── app.service.ts          # Main app service
└── main.ts                 # Application entry point with security setup
```

## Security Features

The application implements multiple layers of security:

### Request Security
- **Helmet.js**: Security headers and CSP configuration
- **CORS Protection**: Environment-based origin validation with security logging
- **Request Sanitization**: MongoDB injection protection
- **Size Limits**: Configurable request size limits
- **Rate Limiting**: Built-in protection against abuse

### Validation & Monitoring
- **Custom Security Validation Pipe**: Enhanced validation with security features
- **Security Interceptor**: Request/response monitoring and threat detection
- **Security Event Logging**: Comprehensive logging of security events
- **Exception Handling**: Custom security exception filters

### Configuration
- **Environment Validation**: Type-safe configuration with validation
- **Security Configuration Service**: Centralized security settings
- **Global Security Module**: Security features available throughout the app

## Environment Configuration

The application uses `@nestjs/config` with comprehensive validation:

### Required Variables
- `NODE_ENV`: Application environment (development/production/test)
- `PORT`: Application port
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_DIALECT`: Database configuration

### Optional Variables
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `MAX_REQUEST_SIZE`: Maximum request size in bytes
- `MAX_SECURITY_EVENTS`: Maximum number of security events to log

## Health Monitoring

The health check system provides:
- **Database Connectivity**: Real-time database connection verification
- **Service Status**: Application health information
- **Timestamped Responses**: For monitoring and alerting
- **Terminus Integration**: Professional health check framework

Access health checks:
- **Comprehensive**: `http://localhost:3000/health`
- **Simple**: `http://localhost:3000/health/simple`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all security checks pass
6. Submit a pull request

## License

This project is licensed under the UNLICENSED License.