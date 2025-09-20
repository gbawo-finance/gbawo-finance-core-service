import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ApiSuccessResponse, ApiErrorResponse } from '../common/decorators/api-response.decorator';

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
  @ApiSuccessResponse('Health check completed successfully')
  @ApiErrorResponse(503, 'Health check failed')
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
  @ApiSuccessResponse('Service is healthy')
  simple(): ApiResponseDto<any> {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'gbawo-finance-core-service',
    };
    return ApiResponseDto.success(healthData, 'Service is healthy');
  }
}
