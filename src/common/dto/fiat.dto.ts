import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsObject,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  SupportedCountry,
  FiatCurrency,
  BankStatus,
  AccountResolutionStatus,
  PaymentMethod,
  TransactionStatus,
} from '../enums';

export class ListBanksQueryDto {
  @ApiPropertyOptional({
    description: 'Country code to filter banks',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  country?: string;
}

export class BankDto {
  @ApiProperty({
    description: 'Bank code',
    example: 'FNB001',
  })
  bank_code: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'First National Bank',
  })
  bank_name: string;

  @ApiProperty({
    description: 'Country code',
    example: SupportedCountry.US,
    enum: SupportedCountry,
  })
  country: SupportedCountry;

  @ApiProperty({
    description: 'Supported currencies',
    example: [FiatCurrency.USD, FiatCurrency.EUR],
    type: [String],
    enum: FiatCurrency,
    isArray: true,
  })
  supported_currencies: FiatCurrency[];

  @ApiProperty({
    description: 'Bank status',
    example: BankStatus.ACTIVE,
    enum: BankStatus,
  })
  status: BankStatus;
}

export class ListBanksResponseDto {
  @ApiProperty({
    description: 'List of supported banks',
    type: [BankDto],
  })
  banks: BankDto[];
}

export class ResolveAccountDto {
  @ApiProperty({
    description: 'Bank code',
    example: 'FNB001',
  })
  @IsString()
  @IsNotEmpty()
  bank_code: string;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;
}

export class ResolveAccountResponseDto {
  @ApiProperty({
    description: 'Resolution status',
    example: AccountResolutionStatus.SUCCESS,
    enum: AccountResolutionStatus,
  })
  status: AccountResolutionStatus;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  account_number: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'John Doe',
  })
  account_name: string;

  @ApiProperty({
    description: 'Bank code',
    example: 'FNB001',
  })
  bank_code: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'First National Bank',
  })
  bank_name: string;

  @ApiProperty({
    description: 'Verification status',
    example: true,
  })
  verified: boolean;

  @ApiPropertyOptional({
    description: 'Error code if verification failed',
    example: 'INVALID_ACCOUNT',
  })
  error_code?: string;

  @ApiPropertyOptional({
    description: 'Error message if verification failed',
    example: 'Account number is invalid',
  })
  message?: string;
}

export class CollectionAccountDto {
  @ApiProperty({
    description: 'Collection account number',
    example: '9876543210',
  })
  account_number: string;

  @ApiProperty({
    description: 'Routing number',
    example: '021000021',
  })
  routing_number: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'Gbawo Collection Bank',
  })
  bank_name: string;
}

export class FiatCollectDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Collection amount',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  currency: FiatCurrency;

  @ApiProperty({
    description: 'Payment method',
    example: PaymentMethod.BANK_TRANSFER,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Collection account details',
    type: CollectionAccountDto,
  })
  @ValidateNested()
  @Type(() => CollectionAccountDto)
  collection_account: CollectionAccountDto;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { invoice_id: 'inv_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CollectionInstructionsDto {
  @ApiProperty({
    description: 'Collection account number',
    example: '9876543210',
  })
  account_number: string;

  @ApiProperty({
    description: 'Routing number',
    example: '021000021',
  })
  routing_number: string;

  @ApiProperty({
    description: 'Payment reference code',
    example: 'REF_123456789',
  })
  reference_code: string;
}

export class FiatCollectResponseDto {
  @ApiProperty({
    description: 'Collection status',
    example: TransactionStatus.WAITING_FOR_PAYMENT,
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  gbawo_transaction_id: string;

  @ApiProperty({
    description: 'Collection reference',
    example: 'COL_123456789',
  })
  collection_reference: string;

  @ApiProperty({
    description: 'Collection instructions',
    type: CollectionInstructionsDto,
  })
  collection_instructions: CollectionInstructionsDto;

  @ApiProperty({
    description: 'Collection timeout timestamp',
    example: '2023-10-01T12:30:00Z',
  })
  timeout_at: string;
}

export class DisburseRecipientDto {
  @ApiProperty({
    description: 'Recipient account number',
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
    example: 'First National Bank',
  })
  bank_name: string;

  @ApiProperty({
    description: 'Recipient name',
    example: 'John Doe',
  })
  name: string;
}

export class FiatDisburseDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Disbursement amount',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  currency: FiatCurrency;

  @ApiProperty({
    description: 'Recipient details',
    type: DisburseRecipientDto,
  })
  @ValidateNested()
  @Type(() => DisburseRecipientDto)
  recipient: DisburseRecipientDto;

  @ApiProperty({
    description: 'Purpose of disbursement',
    example: 'Business payment',
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { invoice_id: 'inv_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class FiatDisburseResponseDto {
  @ApiProperty({
    description: 'Disbursement status',
    example: TransactionStatus.PROCESSING,
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  gbawo_transaction_id: string;

  @ApiProperty({
    description: 'Disbursement reference',
    example: 'DIS_123456789',
  })
  disbursement_reference: string;

  @ApiProperty({
    description: 'Estimated completion time',
    example: '2023-10-01T15:00:00Z',
  })
  estimated_completion: string;

  @ApiProperty({
    description: 'Processing fees',
    example: 2.5,
  })
  fees: number;
}
