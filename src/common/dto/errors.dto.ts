import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error type',
    example: 'validation_error',
  })
  error: string;

  @ApiProperty({
    description: 'Error message',
    example: 'The provided data is invalid',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  code: number;

  @ApiPropertyOptional({
    description: 'Additional error metadata',
    example: { field: 'email', value: 'invalid-email' },
  })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'User ID related to the error',
    example: 'usr_123456789',
  })
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Current KYC level',
    example: '1',
  })
  current_kyc_level?: string;

  @ApiPropertyOptional({
    description: 'Required KYC level',
    example: '2',
  })
  required_kyc_level?: string;

  @ApiPropertyOptional({
    description: 'KYC upgrade link',
    example: 'https://gbawo.com/kyc/upgrade',
  })
  kyc_link?: string;

  @ApiPropertyOptional({
    description: 'Estimated completion time',
    example: '2023-10-01T15:00:00Z',
  })
  estimated_completion_time?: string;

  @ApiPropertyOptional({
    description: 'Estimated upgrade time',
    example: '2023-10-01T14:00:00Z',
  })
  estimated_upgrade_time?: string;
}

export class ValidationErrorDto {
  @ApiProperty({
    description: 'Error type',
    example: 'validation_error',
  })
  error: string;

  @ApiProperty({
    description: 'Validation error message',
    example: 'Transaction amount exceeds available limit',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  code: number;

  @ApiProperty({
    description: 'Validation metadata',
    example: {
      requested_amount: 1000.0,
      available_limit: 500.0,
      limit_reset_at: '2023-10-02T00:00:00Z',
    },
  })
  metadata: {
    requested_amount: number;
    available_limit: number;
    limit_reset_at: string;
  };
}

export class InsufficientKycErrorDto {
  @ApiProperty({
    description: 'Error type',
    example: 'insufficient_kyc_level',
  })
  error: 'insufficient_kyc_level';

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Your current KYC level is insufficient for this transaction',
  })
  message: string;

  @ApiProperty({
    description: 'Current KYC level',
    example: '1',
  })
  current_level: string;

  @ApiProperty({
    description: 'Required KYC level',
    example: '2',
  })
  required_level: string;

  @ApiProperty({
    description: 'KYC upgrade link',
    example: 'https://gbawo.com/kyc/upgrade',
  })
  kyc_link: string;

  @ApiProperty({
    description: 'Estimated upgrade time',
    example: '2023-10-01T14:00:00Z',
  })
  estimated_upgrade_time: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 403,
  })
  code: 403;
}

export class KycRequiredErrorDto {
  @ApiProperty({
    description: 'Error type',
    example: 'kyc_verification_required',
  })
  error: 'kyc_verification_required';

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Error message',
    example: 'KYC verification is required to perform this action',
  })
  message: string;

  @ApiProperty({
    description: 'Current KYC level',
    example: '0',
  })
  current_kyc_level: string;

  @ApiProperty({
    description: 'Required KYC level',
    example: '1',
  })
  required_kyc_level: string;

  @ApiProperty({
    description: 'KYC verification link',
    example: 'https://gbawo.com/kyc/verify',
  })
  kyc_link: string;

  @ApiProperty({
    description: 'Estimated completion time',
    example: '2023-10-01T13:00:00Z',
  })
  estimated_completion_time: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 403,
  })
  code: 403;
}
