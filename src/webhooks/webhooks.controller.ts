import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { WebhookPayloadDto, KycWebhookPayloadDto } from '../common/dto/webhooks.dto';
import { WebhooksService } from './webhooks.service';

@ApiTags('Internal Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('fiat/collection/completed')
  @ApiOperation({ summary: 'Handle fiat collection completed webhook' })
  @ApiResponse({
    status: 200,
    description: 'Fiat collection completed webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  async handleFiatCollectionCompleted(
    @Body() webhookPayload: WebhookPayloadDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result =
      await this.webhooksService.handleFiatCollectionCompleted(webhookPayload);
    return ApiResponseDto.success(result, 'Fiat collection webhook processed');
  }

  @Post('fiat/disbursement/completed')
  @ApiOperation({ summary: 'Handle fiat disbursement completed webhook' })
  @ApiResponse({
    status: 200,
    description: 'Fiat disbursement completed webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  async handleFiatDisbursementCompleted(
    @Body() webhookPayload: WebhookPayloadDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result =
      await this.webhooksService.handleFiatDisbursementCompleted(
        webhookPayload,
      );
    return ApiResponseDto.success(
      result,
      'Fiat disbursement webhook processed',
    );
  }

  @Post('crypto/transfer/confirmed')
  @ApiOperation({ summary: 'Handle crypto transfer confirmed webhook' })
  @ApiResponse({
    status: 200,
    description: 'Crypto transfer confirmed webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  async handleCryptoTransferConfirmed(
    @Body() webhookPayload: WebhookPayloadDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result =
      await this.webhooksService.handleCryptoTransferConfirmed(webhookPayload);
    return ApiResponseDto.success(result, 'Crypto transfer webhook processed');
  }

  @Post('crypto/receive/detected')
  @ApiOperation({ summary: 'Handle crypto deposit detected webhook' })
  @ApiResponse({
    status: 200,
    description: 'Crypto deposit detected webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  async handleCryptoReceiveDetected(
    @Body() webhookPayload: WebhookPayloadDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result =
      await this.webhooksService.handleCryptoReceiveDetected(webhookPayload);
    return ApiResponseDto.success(result, 'Crypto receive webhook processed');
  }

  @Post('kyc/verification/completed')
  @ApiOperation({ summary: 'Handle KYC verification completed webhook' })
  @ApiResponse({
    status: 200,
    description: 'KYC verification completed webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid webhook signature',
  })
  async handleKycVerificationCompleted(
    @Body() webhookPayload: KycWebhookPayloadDto,
  ): Promise<ApiResponseDto<{ status: string; message: string }>> {
    const result =
      await this.webhooksService.handleKycVerificationCompleted(webhookPayload);
    return ApiResponseDto.success(result, 'KYC verification webhook processed');
  }
}
