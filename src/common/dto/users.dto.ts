import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
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
import { PaginationQueryDto, PaginationMetaDto } from './pagination.dto';

export class CreateUserDto {
  @ApiProperty({
    description: 'Integrator ID that the user belongs to',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

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
    description: 'Integrator ID that the user belongs to',
    example: 'int_123456789',
  })
  integrator_id: string;

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

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Integrator ID to filter users',
    example: 'int_123456789',
  })
  @IsOptional()
  @IsString()
  integrator_id?: string;

  @ApiPropertyOptional({
    description: 'User account status filter',
    example: UserAccountStatus.ACTIVE,
    enum: UserAccountStatus,
  })
  @IsOptional()
  @IsEnum(UserAccountStatus)
  status?: UserAccountStatus;

  @ApiPropertyOptional({
    description: 'KYC level filter',
    example: KycLevel.LEVEL_1,
    enum: KycLevel,
  })
  @IsOptional()
  @IsEnum(KycLevel)
  kyc_level?: KycLevel;

  @ApiPropertyOptional({
    description: 'Search term for email or name',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class UserSummaryDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Integrator ID that the user belongs to',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  full_name: string;

  @ApiProperty({
    description: 'User account status',
    example: UserAccountStatus.ACTIVE,
    enum: UserAccountStatus,
  })
  account_status: UserAccountStatus;

  @ApiProperty({
    description: 'User KYC level',
    example: KycLevel.LEVEL_1,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last activity timestamp',
    example: '2023-12-01T15:30:00Z',
  })
  last_activity?: string;
}

export class ListUsersResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserSummaryDto],
  })
  data: UserSummaryDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  pagination: PaginationMetaDto;
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
    description: 'Integrator ID that the user belongs to',
    example: 'int_123456789',
  })
  integrator_id: string;

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

  @ApiPropertyOptional({
    description: 'User account status',
    example: UserAccountStatus.ACTIVE,
    enum: UserAccountStatus,
  })
  @IsOptional()
  @IsEnum(UserAccountStatus)
  status?: UserAccountStatus;
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

export class ReserveAccountNumberDto {
  @ApiProperty({
    description: 'Country code for account reservation',
    example: SupportedCountry.US,
    enum: SupportedCountry,
  })
  @IsEnum(SupportedCountry)
  country: SupportedCountry;

  @ApiPropertyOptional({
    description: 'Preferred currency for the account',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsOptional()
  @IsEnum(FiatCurrency)
  currency?: FiatCurrency;

  @ApiPropertyOptional({
    description: 'Additional metadata for account reservation',
    example: { purpose: 'savings', account_type: 'personal' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ReserveWalletAddressDto {
  @ApiProperty({
    description: 'Cryptocurrency to reserve wallet for',
    example: 'BTC',
  })
  @IsString()
  @IsNotEmpty()
  crypto_currency: string;

  @ApiProperty({
    description: 'Network for the cryptocurrency',
    example: 'bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  network: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for wallet reservation',
    example: { purpose: 'trading', wallet_type: 'hot' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ReservedAccountDto {
  @ApiProperty({
    description: 'Reserved account ID',
    example: 'acc_123456789',
  })
  account_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  account_number: string;

  @ApiProperty({
    description: 'Routing number',
    example: '021000021',
  })
  routing_number: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'Gbawo Partner Bank',
  })
  bank_name: string;

  @ApiProperty({
    description: 'Bank code',
    example: 'GBAWO001',
  })
  bank_code: string;

  @ApiProperty({
    description: 'Country code',
    example: SupportedCountry.US,
    enum: SupportedCountry,
  })
  country: SupportedCountry;

  @ApiProperty({
    description: 'Account currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  currency: FiatCurrency;

  @ApiProperty({
    description: 'Account status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-12-01T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Account expiration timestamp',
    example: '2024-12-01T10:30:00Z',
  })
  expires_at: string;

  @ApiPropertyOptional({
    description: 'Additional account metadata',
    example: { purpose: 'savings', account_type: 'personal' },
  })
  metadata?: Record<string, any>;
}

export class ReservedWalletDto {
  @ApiProperty({
    description: 'Reserved wallet ID',
    example: 'wal_123456789',
  })
  wallet_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Wallet address',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  })
  address: string;

  @ApiProperty({
    description: 'Cryptocurrency',
    example: 'BTC',
  })
  crypto_currency: string;

  @ApiProperty({
    description: 'Network',
    example: 'bitcoin',
  })
  network: string;

  @ApiProperty({
    description: 'Wallet status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Wallet creation timestamp',
    example: '2023-12-01T10:30:00Z',
  })
  created_at: string;

  @ApiPropertyOptional({
    description: 'Additional wallet metadata',
    example: { purpose: 'trading', wallet_type: 'hot' },
  })
  metadata?: Record<string, any>;
}
