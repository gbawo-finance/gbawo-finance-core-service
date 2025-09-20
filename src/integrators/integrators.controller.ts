import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IntegratorsService } from './integrators.service';
import {
  IntegratorProfileDto,
  UpdateIntegratorDto,
  ApiKeysResponseDto,
  RotateApiKeyResponseDto,
  WebhookConfigDto,
  WebhookResponseDto,
  WebhookTestDto,
  WebhookTestResponseDto,
  IntegratorLimitsResponseDto,
  UpdateIntegratorLimitsDto,
  IntegratorAnalyticsDto,
  SettlementReportDto,
  ReconciliationReportDto,
  IntegratorRatesConfigDto,
  UpdateIntegratorRatesConfigDto,
  IntegratorsListResponseDto,
} from '../common/dto/integrators.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Integrators')
@Controller('integrators')
export class IntegratorsController {
  constructor(private readonly integratorsService: IntegratorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of integrators' })
  @ApiResponse({
    status: 200,
    description: 'Integrators list retrieved successfully',
    type: IntegratorsListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getAllIntegrators(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('integration_type') integrationType?: string,
  ): Promise<ApiResponseDto<IntegratorsListResponseDto>> {
    const integrators = await this.integratorsService.getAllIntegrators(
      page || 1,
      limit || 20,
      status,
      integrationType,
    );
    return ApiResponseDto.success(
      integrators,
      'Integrators list retrieved successfully',
    );
  }

  @Get(':integratorId')
  @ApiOperation({ summary: 'Get integrator profile and settings' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Integrator profile retrieved successfully',
    type: IntegratorProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getIntegratorProfile(
    @Param('integratorId') integratorId: string,
  ): Promise<ApiResponseDto<IntegratorProfileDto>> {
    const profile =
      await this.integratorsService.getIntegratorProfile(integratorId);
    return ApiResponseDto.success(
      profile,
      'Integrator profile retrieved successfully',
    );
  }

  @Put(':integratorId')
  @ApiOperation({ summary: 'Update integrator configuration' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Integrator configuration updated successfully',
    type: IntegratorProfileDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid configuration data',
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async updateIntegratorConfiguration(
    @Param('integratorId') integratorId: string,
    @Body() updateData: UpdateIntegratorDto,
  ): Promise<ApiResponseDto<IntegratorProfileDto>> {
    const updatedProfile =
      await this.integratorsService.updateIntegratorConfiguration(
        integratorId,
        updateData,
      );
    return ApiResponseDto.success(
      updatedProfile,
      'Integrator configuration updated successfully',
    );
  }

  @Get(':integratorId/api-keys')
  @ApiOperation({ summary: 'Get API credentials' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'API keys retrieved successfully',
    type: ApiKeysResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getApiKeys(
    @Param('integratorId') integratorId: string,
  ): Promise<ApiResponseDto<ApiKeysResponseDto>> {
    const apiKeys = await this.integratorsService.getApiKeys(integratorId);
    return ApiResponseDto.success(apiKeys, 'API keys retrieved successfully');
  }

  @Post(':integratorId/api-keys/rotate')
  @ApiOperation({ summary: 'Rotate API keys' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 201,
    description: 'API key rotated successfully',
    type: RotateApiKeyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async rotateApiKey(
    @Param('integratorId') integratorId: string,
    @Body() body: { key_id: string },
  ): Promise<ApiResponseDto<RotateApiKeyResponseDto>> {
    const rotationResult = await this.integratorsService.rotateApiKey(
      integratorId,
      body.key_id,
    );
    return ApiResponseDto.success(
      rotationResult,
      'API key rotated successfully',
    );
  }

  @Get(':integratorId/webhooks')
  @ApiOperation({ summary: 'Get webhook configuration' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook configuration retrieved successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getWebhookConfiguration(
    @Param('integratorId') integratorId: string,
  ): Promise<ApiResponseDto<WebhookResponseDto>> {
    const webhookConfig =
      await this.integratorsService.getWebhookConfiguration(integratorId);
    return ApiResponseDto.success(
      webhookConfig,
      'Webhook configuration retrieved successfully',
    );
  }

  @Put(':integratorId/webhooks')
  @ApiOperation({ summary: 'Update webhook URLs and configuration' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook configuration updated successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async updateWebhookConfiguration(
    @Param('integratorId') integratorId: string,
    @Body() webhookConfig: WebhookConfigDto,
  ): Promise<ApiResponseDto<WebhookResponseDto>> {
    const updatedConfig =
      await this.integratorsService.updateWebhookConfiguration(
        integratorId,
        webhookConfig,
      );
    return ApiResponseDto.success(
      updatedConfig,
      'Webhook configuration updated successfully',
    );
  }

  @Post(':integratorId/webhooks/test')
  @ApiOperation({ summary: 'Test webhook endpoints' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook test completed',
    type: WebhookTestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid test configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async testWebhookEndpoint(
    @Param('integratorId') integratorId: string,
    @Body() testConfig: WebhookTestDto,
  ): Promise<ApiResponseDto<WebhookTestResponseDto>> {
    const testResult = await this.integratorsService.testWebhookEndpoint(
      integratorId,
      testConfig,
    );
    return ApiResponseDto.success(testResult, 'Webhook test completed');
  }

  @Get(':integratorId/limits')
  @ApiOperation({ summary: 'Get integrator transaction limits' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction limits retrieved successfully',
    type: IntegratorLimitsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getIntegratorLimits(
    @Param('integratorId') integratorId: string,
  ): Promise<ApiResponseDto<IntegratorLimitsResponseDto>> {
    const limits =
      await this.integratorsService.getIntegratorLimits(integratorId);
    return ApiResponseDto.success(
      limits,
      'Transaction limits retrieved successfully',
    );
  }

  @Put(':integratorId/limits')
  @ApiOperation({ summary: 'Update integrator transaction limits (min & max)' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction limits updated successfully',
    type: IntegratorLimitsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid limits configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async updateIntegratorLimits(
    @Param('integratorId') integratorId: string,
    @Body() updateData: UpdateIntegratorLimitsDto,
  ): Promise<ApiResponseDto<IntegratorLimitsResponseDto>> {
    const updatedLimits = await this.integratorsService.updateIntegratorLimits(
      integratorId,
      updateData,
    );
    return ApiResponseDto.success(
      updatedLimits,
      'Transaction limits updated successfully',
    );
  }

  @Get(':integratorId/analytics')
  @ApiOperation({
    summary: 'Get integrator analytics - Volume, fees, success rates',
  })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
    type: IntegratorAnalyticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getIntegratorAnalytics(
    @Param('integratorId') integratorId: string,
    @Query('period') period?: string,
  ): Promise<ApiResponseDto<IntegratorAnalyticsDto>> {
    const analytics = await this.integratorsService.getIntegratorAnalytics(
      integratorId,
      period,
    );
    return ApiResponseDto.success(
      analytics,
      'Analytics retrieved successfully',
    );
  }

  @Get(':integratorId/settlement')
  @ApiOperation({ summary: 'Get settlement reports' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Settlement report retrieved successfully',
    type: SettlementReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getSettlementReport(
    @Param('integratorId') integratorId: string,
    @Query('period_start') periodStart?: string,
    @Query('period_end') periodEnd?: string,
  ): Promise<ApiResponseDto<SettlementReportDto>> {
    const report = await this.integratorsService.getSettlementReport(
      integratorId,
      periodStart,
      periodEnd,
    );
    return ApiResponseDto.success(
      report,
      'Settlement report retrieved successfully',
    );
  }

  @Get(':integratorId/reconciliation')
  @ApiOperation({ summary: 'Get daily/monthly reconciliation reports' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Reconciliation report retrieved successfully',
    type: ReconciliationReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getReconciliationReport(
    @Param('integratorId') integratorId: string,
    @Query('period_type') periodType?: string,
    @Query('report_date') reportDate?: string,
  ): Promise<ApiResponseDto<ReconciliationReportDto>> {
    const report = await this.integratorsService.getReconciliationReport(
      integratorId,
      periodType,
      reportDate,
    );
    return ApiResponseDto.success(
      report,
      'Reconciliation report retrieved successfully',
    );
  }

  @Get(':integratorId/rates/config')
  @ApiOperation({ summary: "Get integrator's fee configuration" })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Rates configuration retrieved successfully',
    type: IntegratorRatesConfigDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async getIntegratorRatesConfig(
    @Param('integratorId') integratorId: string,
  ): Promise<ApiResponseDto<IntegratorRatesConfigDto>> {
    const config =
      await this.integratorsService.getIntegratorRatesConfig(integratorId);
    return ApiResponseDto.success(
      config,
      'Rates configuration retrieved successfully',
    );
  }

  @Put(':integratorId/rates/config')
  @ApiOperation({ summary: 'Update fee structures (static/dynamic/capped)' })
  @ApiParam({
    name: 'integratorId',
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Rates configuration updated successfully',
    type: IntegratorRatesConfigDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid rates configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Integrator not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied',
  })
  async updateIntegratorRatesConfig(
    @Param('integratorId') integratorId: string,
    @Body() updateData: UpdateIntegratorRatesConfigDto,
  ): Promise<ApiResponseDto<IntegratorRatesConfigDto>> {
    const updatedConfig =
      await this.integratorsService.updateIntegratorRatesConfig(
        integratorId,
        updateData,
      );
    return ApiResponseDto.success(
      updatedConfig,
      'Rates configuration updated successfully',
    );
  }
}
