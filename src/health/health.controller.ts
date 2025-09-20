import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Health')
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
    description:
      'Performs a comprehensive health check including database connectivity',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed successfully',
    schema: {
      example: {
        success: true,
        message: 'Health check completed successfully',
        data: {
          status: 'ok',
          info: { database: { status: 'up' } },
          error: {},
          details: { database: { status: 'up' } },
        },
      },
    },
  })
  async check(): Promise<ApiResponseDto<any>> {
    try {
      const healthResult = await this.health.check([() => this.db.pingCheck('database')]);
      return ApiResponseDto.success(healthResult, 'Health check completed successfully');
    } catch (error) {
      return ApiResponseDto.error('Health check failed', error);
    }
  }

  @Get('simple')
  @ApiOperation({
    summary: 'Simple health check',
    description: 'Returns a simple health status with timestamp',
  })
  @ApiResponse({
    status: 200,
    description: 'Simple health status',
    schema: {
      example: {
        success: true,
        message: 'Service is healthy',
        data: {
          status: 'ok',
          timestamp: '2025-01-19T19:13:33.172Z',
          service: 'gbawo-finance-core-service',
        },
      },
    },
  })
  simple(): ApiResponseDto<any> {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'gbawo-finance-core-service',
    };
    return ApiResponseDto.success(healthData, 'Service is healthy');
  }
}
