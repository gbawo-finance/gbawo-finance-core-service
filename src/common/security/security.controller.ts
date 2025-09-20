import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';
import { SecurityEvent, SecurityService } from './security.service';

@ApiTags('Security')
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('events')
  @ApiOperation({
    summary: 'Get recent security events',
    description: 'Retrieve recent security events for monitoring purposes',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of events to return (max 100)',
  })
  @ApiResponse({
    status: 200,
    description: 'Security events retrieved successfully',
    type: ApiResponseDto,
  })
  getSecurityEvents(
    @Query('limit') limit?: number,
  ): ApiResponseDto<SecurityEvent[]> {
    const eventLimit = Math.min(limit || 50, 100); // Cap at 100 events
    const events = this.securityService.getRecentSecurityEvents(eventLimit);

    return ApiResponseDto.success(
      events,
      `Retrieved ${events.length} recent security events`,
    );
  }

  @Get('events/by-type')
  @ApiOperation({
    summary: 'Get security events by type',
    description: 'Retrieve security events filtered by event type',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    type: String,
    description: 'Event type to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered security events retrieved successfully',
    type: ApiResponseDto,
  })
  getSecurityEventsByType(
    @Query('type') type: string,
  ): ApiResponseDto<SecurityEvent[]> {
    const events = this.securityService.getSecurityEventsByType(type);

    return ApiResponseDto.success(
      events,
      `Retrieved ${events.length} events of type: ${type}`,
    );
  }

  @Get('health')
  @ApiOperation({
    summary: 'Security system health check',
    description: 'Check the health of security monitoring systems',
  })
  @ApiResponse({
    status: 200,
    description: 'Security health check completed',
    type: ApiResponseDto,
  })
  securityHealth(): ApiResponseDto<any> {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      features: {
        logging: 'active',
        headerValidation: 'active',
        inputSanitization: 'active',
        corsProtection: 'active',
        securityHeaders: 'active',
      },
      metrics: {
        totalEvents: this.securityService.getRecentSecurityEvents(1000).length,
        recentCriticalEvents: this.securityService
          .getRecentSecurityEvents(100)
          .filter((event) => event.severity === 'critical').length,
      },
    };

    return ApiResponseDto.success(
      healthData,
      'Security systems are operational',
    );
  }
}
