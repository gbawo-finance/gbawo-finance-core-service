import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: SequelizeHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Comprehensive health check',
    description: 'Performs a comprehensive health check including database connectivity'
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed successfully',
    schema: {
      example: {
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } }
      }
    }
  })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('simple')
  @ApiOperation({
    summary: 'Simple health check',
    description: 'Returns a simple health status with timestamp'
  })
  @ApiResponse({
    status: 200,
    description: 'Simple health status',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-01-19T19:13:33.172Z',
        service: 'gbawo-finance-core-service'
      }
    }
  })
  simple() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'gbawo-finance-core-service',
    };
  }
} 