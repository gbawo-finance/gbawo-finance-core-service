import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RateCalculationDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Source currency code',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  source_currency: string;

  @ApiProperty({
    description: 'Target currency code',
    example: 'EUR',
  })
  @IsString()
  @IsNotEmpty()
  target_currency: string;

  @ApiProperty({
    description: 'Source amount',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  source_amount: number;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {
      source_network: 'ethereum',
      target_network: 'polygon',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    source_network?: string;
    target_network?: string;
  };
}

export class FeesDto {
  @ApiProperty({
    description: 'Platform fee',
    example: 2.5,
  })
  platform_fee: number;

  @ApiPropertyOptional({
    description: 'Network fee',
    example: 0.001,
  })
  network_fee?: number;

  @ApiPropertyOptional({
    description: 'Bank transfer fee',
    example: 15.0,
  })
  bank_transfer_fee?: number;

  @ApiPropertyOptional({
    description: 'Correspondent bank fee',
    example: 25.0,
  })
  correspondent_bank_fee?: number;

  @ApiProperty({
    description: 'Integrator fee',
    example: 1.0,
  })
  integrator_fee: number;

  @ApiProperty({
    description: 'Total fees',
    example: 43.5,
  })
  total_fees: number;
}

export class UserEligibilityDto {
  @ApiProperty({
    description: 'Current KYC level',
    example: '1',
  })
  current_kyc_level: string;

  @ApiProperty({
    description: 'Required KYC level',
    example: '2',
  })
  required_kyc_level: string;

  @ApiProperty({
    description: 'User eligibility status',
    example: false,
  })
  eligible: boolean;
}

export class LimitsDto {
  @ApiProperty({
    description: 'Available daily limit',
    example: 5000.0,
  })
  available_daily: number;

  @ApiProperty({
    description: 'Available monthly limit',
    example: 50000.0,
  })
  available_monthly: number;

  @ApiProperty({
    description: 'Transaction within limits status',
    example: true,
  })
  transaction_within_limits: boolean;
}

export class RateResponseDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  transaction_type: string;

  @ApiProperty({
    description: 'Source currency',
    example: 'USD',
  })
  source_currency: string;

  @ApiProperty({
    description: 'Target currency',
    example: 'BTC',
  })
  target_currency: string;

  @ApiProperty({
    description: 'Source amount',
    example: 100.5,
  })
  source_amount: number;

  @ApiProperty({
    description: 'Target amount',
    example: 0.00245,
  })
  target_amount: number;

  @ApiProperty({
    description: 'Exchange rate',
    example: 0.0000244,
  })
  exchange_rate: number;

  @ApiProperty({
    description: 'Fee breakdown',
    type: FeesDto,
  })
  fees: FeesDto;

  @ApiProperty({
    description: 'User eligibility information',
    type: UserEligibilityDto,
  })
  user_eligibility: UserEligibilityDto;

  @ApiProperty({
    description: 'Transaction limits',
    type: LimitsDto,
  })
  limits: LimitsDto;

  @ApiProperty({
    description: 'Additional metadata',
    example: { rate_id: 'rate_123456789' },
  })
  metadata: Record<string, any>;
}
