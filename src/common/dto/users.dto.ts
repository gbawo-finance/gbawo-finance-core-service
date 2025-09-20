import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  UserAccountStatus,
  KycLevel,
  KycStatus,
  DocumentType,
  DocumentStatus,
  LegacyKycLevel,
  SupportedCountry,
  FiatCurrency,
} from '../enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;
}

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'Account status',
    example: UserAccountStatus.ACTIVE,
    enum: UserAccountStatus,
  })
  account_status: UserAccountStatus;

  @ApiProperty({
    description: 'KYC level',
    example: KycLevel.LEVEL_0,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'Available services',
    example: ['basic_transfer'],
    type: [String],
  })
  available_services: string[];

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: string;
}

export class SubmitKycDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'KYC level to submit',
    example: LegacyKycLevel.LEVEL_1,
    enum: LegacyKycLevel,
  })
  @IsEnum(LegacyKycLevel)
  level: LegacyKycLevel;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone_number: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-15',
  })
  date_of_birth: string;

  @ApiProperty({
    description: 'User country',
    example: SupportedCountry.US,
    enum: SupportedCountry,
  })
  country: SupportedCountry;

  @ApiProperty({
    description: 'User account status',
    example: UserAccountStatus.ACTIVE,
    enum: UserAccountStatus,
  })
  status: UserAccountStatus;

  @ApiProperty({
    description: 'Current KYC level',
    example: KycLevel.LEVEL_2,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'KYC verification status',
    example: KycStatus.VERIFIED,
    enum: KycStatus,
  })
  kyc_status: KycStatus;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-11-01T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last profile update timestamp',
    example: '2023-12-01T14:20:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'User verification flags',
    example: {
      email_verified: true,
      phone_verified: true,
      identity_verified: true,
      address_verified: false,
    },
  })
  verification_flags: {
    email_verified: boolean;
    phone_verified: boolean;
    identity_verified: boolean;
    address_verified: boolean;
  };
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '1990-01-15',
  })
  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  country?: string;
}

export class KycDocumentDto {
  @ApiProperty({
    description: 'Document ID',
    example: 'doc_123456789',
  })
  document_id: string;

  @ApiProperty({
    description: 'Document type',
    example: DocumentType.PASSPORT,
    enum: DocumentType,
  })
  document_type: DocumentType;

  @ApiProperty({
    description: 'Document status',
    example: DocumentStatus.VERIFIED,
    enum: DocumentStatus,
  })
  status: DocumentStatus;

  @ApiProperty({
    description: 'Document upload timestamp',
    example: '2023-11-15T09:30:00Z',
  })
  uploaded_at: string;

  @ApiProperty({
    description: 'Document verification timestamp',
    example: '2023-11-15T10:45:00Z',
  })
  verified_at?: string;

  @ApiProperty({
    description: 'Rejection reason if applicable',
    example: 'Document image is blurry',
  })
  rejection_reason?: string;
}

export class KycHistoryEntryDto {
  @ApiProperty({
    description: 'KYC entry ID',
    example: 'kyc_123456789',
  })
  entry_id: string;

  @ApiProperty({
    description: 'KYC level attempted',
    example: KycLevel.LEVEL_2,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'KYC status',
    example: KycStatus.VERIFIED,
    enum: KycStatus,
  })
  status: KycStatus;

  @ApiProperty({
    description: 'Submission timestamp',
    example: '2023-11-15T09:30:00Z',
  })
  submitted_at: string;

  @ApiProperty({
    description: 'Review completion timestamp',
    example: '2023-11-15T10:45:00Z',
  })
  reviewed_at?: string;

  @ApiProperty({
    description: 'Reviewer notes',
    example: 'All documents verified successfully',
  })
  reviewer_notes?: string;

  @ApiProperty({
    description: 'Documents submitted for this KYC level',
    type: [KycDocumentDto],
  })
  documents: KycDocumentDto[];
}

export class UserKycStatusDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Current KYC level',
    example: KycLevel.LEVEL_2,
    enum: KycLevel,
  })
  current_kyc_level: KycLevel;

  @ApiProperty({
    description: 'Overall KYC status',
    example: KycStatus.VERIFIED,
    enum: KycStatus,
  })
  overall_status: KycStatus;

  @ApiProperty({
    description: 'Next available KYC level',
    example: 'level_3',
  })
  next_available_level?: string;

  @ApiProperty({
    description: 'KYC completion percentage',
    example: 85.5,
  })
  completion_percentage: number;

  @ApiProperty({
    description: 'Required documents for next level',
    example: ['bank_statement', 'proof_of_address'],
  })
  required_documents_next_level?: string[];

  @ApiProperty({
    description: 'Transaction limits for current KYC level',
    example: {
      daily_limit: 10000,
      monthly_limit: 50000,
      single_transaction_limit: 5000,
      currency: FiatCurrency.USD,
    },
  })
  transaction_limits: {
    daily_limit: number;
    monthly_limit: number;
    single_transaction_limit: number;
    currency: FiatCurrency;
  };

  @ApiProperty({
    description: 'KYC history entries',
    type: [KycHistoryEntryDto],
  })
  kyc_history: KycHistoryEntryDto[];

  @ApiProperty({
    description: 'Last KYC update timestamp',
    example: '2023-11-15T10:45:00Z',
  })
  last_updated: string;
}
