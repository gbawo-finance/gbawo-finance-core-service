# Gbawo Finance Core Service

A NestJS-based microservice for the Gbawo Finance platform, providing core financial services with TypeScript, PostgreSQL, and Sequelize ORM.

## Features

- 🚀 Built with NestJS and TypeScript
- 🗃️ PostgreSQL database with Sequelize ORM
- 🏥 Health check endpoints with database connectivity monitoring
- 🔧 Environment-based configuration
- ✅ Input validation with class-validator
- 🌐 CORS enabled
- 🛡️ Global API prefix (`/api/v1`)

## Prerequisites

- Node.js (v18+ recommended)
- Docker and Docker Compose (for development database)
- npm or yarn

### Alternative without Docker
- PostgreSQL database (if not using Docker)

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
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=gbawo_finance
DB_DIALECT=postgres

# Application Configuration
PORT=3000
NODE_ENV=development
```

4. Set up the database:

**Option A: Using Docker (Recommended for Development)**
```bash
# Start PostgreSQL with Docker
npm run db:start

# Or start with Adminer (web database admin)
npm run db:up
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
```

The application will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Checks
- `GET /health` - Comprehensive health check including database connectivity
- `GET /health/simple` - Simple health check with timestamp

### Application Routes
All application routes are prefixed with `/api/v1/` (health endpoints are excluded from this prefix).

## Database

The application uses Sequelize ORM with PostgreSQL. The database configuration supports:
- Auto-loading of models
- Development mode synchronization
- Environment-based logging

### Docker Development Database

For development convenience, we provide a Docker Compose setup with PostgreSQL and Adminer (web-based database admin).

#### Quick Start
```bash
# Start database only
npm run db:start

# Start database with Adminer web UI
npm run db:up

# Check status
npm run db:status

# View logs
npm run db:logs

# Stop services
npm run db:down

# Reset database (deletes all data)
npm run db:reset
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
Visit http://localhost:8080 when running `npm run db:up`:
- **System**: PostgreSQL
- **Server**: postgres
- **Username**: postgres
- **Password**: password
- **Database**: gbawo_finance

## Development

```bash
# Watch mode for development
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov

# Lint code
npm run lint
```

## Project Structure

```
src/
├── config/
│   └── database.config.ts    # Database configuration
├── health/
│   ├── health.controller.ts  # Health check endpoints
│   └── health.module.ts      # Health module
├── app.controller.ts         # Main app controller
├── app.module.ts            # Root application module
├── app.service.ts           # Main app service
└── main.ts                  # Application entry point
```

## Environment Configuration

The application uses `@nestjs/config` for environment management:
- Global configuration module
- Support for multiple env files (`.env.local`, `.env`)
- Type-safe configuration access

## Health Monitoring

The health check system provides:
- Database connectivity verification
- Service status information
- Timestamped responses
- Integration with monitoring tools

Access health checks:
- Detailed: `http://localhost:3000/health`
- Simple: `http://localhost:3000/health/simple`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
