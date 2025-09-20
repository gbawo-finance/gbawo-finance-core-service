import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookPayloadDto {
  @ApiProperty({
    description: 'Event type',
    example: 'fiat.collection.completed',
  })
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @ApiProperty({
    description: 'Event timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  @IsString()
  @IsNotEmpty()
  gbawo_transaction_id: string;

  @ApiPropertyOptional({
    description: 'Integrator transaction ID',
    example: 'int_txn_123456789',
  })
  @IsOptional()
  @IsString()
  integrator_transaction_id?: string;

  @ApiProperty({
    description: 'Reference code',
    example: 'REF_123456789',
  })
  @IsString()
  @IsNotEmpty()
  reference_code: string;

  @ApiProperty({
    description: 'Transaction status',
    example: 'completed',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Event data',
    example: {
      fiat_received: 100.5,
      fiat_currency: 'USD',
      crypto_sent: '0.001',
      crypto_currency: 'BTC',
    },
  })
  @IsObject()
  data: Record<string, any>;
}

export class OnrampCompletedDataDto {
  @ApiProperty({
    description: 'Fiat amount received',
    example: 100.5,
  })
  fiat_received: number;

  @ApiProperty({
    description: 'Fiat currency',
    example: 'USD',
  })
  fiat_currency: string;

  @ApiProperty({
    description: 'Crypto amount sent',
    example: '0.001',
  })
  crypto_sent: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: 'BTC',
  })
  crypto_currency: string;

  @ApiProperty({
    description: 'Crypto network',
    example: 'bitcoin',
  })
  crypto_network: string;

  @ApiProperty({
    description: 'Crypto transaction hash',
    example: '6f8b8e0c5f5c4a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  })
  crypto_tx_hash: string;

  @ApiProperty({
    description: 'Recipient address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  recipient_address: string;

  @ApiProperty({
    description: 'Exchange rate',
    example: 0.0000244,
  })
  exchange_rate: number;

  @ApiProperty({
    description: 'Total fees',
    example: 2.5,
  })
  fees: number;

  @ApiProperty({
    description: 'Processing time in seconds',
    example: 180,
  })
  processing_time_seconds: number;
}

export class OfframpCompletedDataDto {
  @ApiProperty({
    description: 'Crypto amount received',
    example: '0.001',
  })
  crypto_received: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: 'BTC',
  })
  crypto_currency: string;

  @ApiProperty({
    description: 'Crypto network',
    example: 'bitcoin',
  })
  crypto_network: string;

  @ApiProperty({
    description: 'Crypto transaction hash',
    example: '6f8b8e0c5f5c4a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  })
  crypto_tx_hash: string;

  @ApiProperty({
    description: 'Fiat amount sent',
    example: 100.5,
  })
  fiat_sent: number;

  @ApiProperty({
    description: 'Fiat currency',
    example: 'USD',
  })
  fiat_currency: string;

  @ApiProperty({
    description: 'Recipient account',
    example: '1234567890',
  })
  recipient_account: string;

  @ApiProperty({
    description: 'Disbursement reference',
    example: 'DIS_123456789',
  })
  disbursement_reference: string;

  @ApiProperty({
    description: 'Exchange rate',
    example: 0.0000244,
  })
  exchange_rate: number;

  @ApiProperty({
    description: 'Total fees',
    example: 2.5,
  })
  fees: number;

  @ApiProperty({
    description: 'Processing time in seconds',
    example: 180,
  })
  processing_time_seconds: number;
}

export class FiatExchangeCompletedDataDto {
  @ApiProperty({
    description: 'Source amount received',
    example: 100.5,
  })
  source_received: number;

  @ApiProperty({
    description: 'Source currency',
    example: 'USD',
  })
  source_currency: string;

  @ApiProperty({
    description: 'Target amount sent',
    example: 85.25,
  })
  target_sent: number;

  @ApiProperty({
    description: 'Target currency',
    example: 'EUR',
  })
  target_currency: string;

  @ApiProperty({
    description: 'Recipient account',
    example: '1234567890',
  })
  recipient_account: string;

  @ApiProperty({
    description: 'Disbursement reference',
    example: 'DIS_123456789',
  })
  disbursement_reference: string;

  @ApiProperty({
    description: 'Exchange rate',
    example: 0.8525,
  })
  exchange_rate: number;

  @ApiProperty({
    description: 'Total fees',
    example: 2.5,
  })
  fees: number;

  @ApiProperty({
    description: 'Processing time in seconds',
    example: 180,
  })
  processing_time_seconds: number;
}

export class CryptoExchangeCompletedDataDto {
  @ApiProperty({
    description: 'Source amount received',
    example: '0.001',
  })
  source_received: string;

  @ApiProperty({
    description: 'Source currency',
    example: 'BTC',
  })
  source_currency: string;

  @ApiProperty({
    description: 'Source network',
    example: 'bitcoin',
  })
  source_network: string;

  @ApiProperty({
    description: 'Source transaction hash',
    example: '6f8b8e0c5f5c4a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  })
  source_tx_hash: string;

  @ApiProperty({
    description: 'Target amount sent',
    example: '0.02',
  })
  target_sent: string;

  @ApiProperty({
    description: 'Target currency',
    example: 'ETH',
  })
  target_currency: string;

  @ApiProperty({
    description: 'Target network',
    example: 'ethereum',
  })
  target_network: string;

  @ApiProperty({
    description: 'Target transaction hash',
    example:
      '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  })
  target_tx_hash: string;

  @ApiProperty({
    description: 'Recipient address',
    example: '0x742d35Cc7Bf58C94532b89B1F93C8ee3Ec3F4E4A',
  })
  recipient_address: string;

  @ApiProperty({
    description: 'Exchange rate',
    example: '20.0',
  })
  exchange_rate: string;

  @ApiProperty({
    description: 'Network fees by network',
    example: {
      bitcoin: '0.00001',
      ethereum: '0.002',
    },
  })
  network_fees: {
    [network: string]: string;
  };

  @ApiProperty({
    description: 'Platform fee',
    example: '0.00005',
  })
  platform_fee: string;

  @ApiProperty({
    description: 'Processing time in seconds',
    example: 180,
  })
  processing_time_seconds: number;
}

export class KycVerificationCompletedDataDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'KYC level that was verified',
    example: 'level_2',
    enum: ['level_1', 'level_2', 'level_3'],
  })
  @IsString()
  @IsNotEmpty()
  kyc_level: string;

  @ApiProperty({
    description: 'KYC verification status',
    example: 'verified',
    enum: ['verified', 'rejected', 'pending_review'],
  })
  @IsString()
  @IsNotEmpty()
  verification_status: string;

  @ApiProperty({
    description: 'KYC verification timestamp',
    example: '2023-12-01T14:30:00Z',
  })
  @IsString()
  @IsNotEmpty()
  verified_at: string;

  @ApiProperty({
    description: 'Verification provider',
    example: 'smile_id',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: 'Provider verification ID',
    example: 'smile_12345',
  })
  @IsString()
  @IsNotEmpty()
  provider_verification_id: string;

  @ApiProperty({
    description: 'Verification score (0-100)',
    example: 95.5,
  })
  @IsNumber()
  verification_score: number;

  @ApiProperty({
    description: 'Rejection reason if status is rejected',
    example: 'Document image quality insufficient',
  })
  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @ApiProperty({
    description: 'Documents that were verified',
    example: [
      {
        document_type: 'passport',
        document_id: 'doc_123',
        status: 'verified',
      },
    ],
  })
  @IsArray()
  verified_documents: Array<{
    document_type: string;
    document_id: string;
    status: string;
  }>;

  @ApiProperty({
    description: 'Additional verification metadata',
    example: {
      face_match_score: 98.2,
      document_authenticity_score: 96.8,
      liveness_check: true,
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class KycWebhookPayloadDto {
  @ApiProperty({
    description: 'Event type',
    example: 'kyc.verification_completed',
  })
  @IsString()
  @IsNotEmpty()
  event_type: 'kyc.verification_completed';

  @ApiProperty({
    description: 'Event timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'KYC verification ID',
    example: 'kyc_123456789',
  })
  @IsString()
  @IsNotEmpty()
  kyc_verification_id: string;

  @ApiProperty({
    description: 'Reference code',
    example: 'KYC_REF_123456789',
  })
  @IsString()
  @IsNotEmpty()
  reference_code: string;

  @ApiProperty({
    description: 'KYC verification data',
    type: KycVerificationCompletedDataDto,
  })
  @IsObject()
  data: KycVerificationCompletedDataDto;
}
