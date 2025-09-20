import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsObject,
  ValidateNested,
  IsEnum,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FiatCurrency,
  CryptoCurrency,
  CryptoNetwork,
  TransactionStatus,
  ActivityType,
  TimelineStep,
  TimelineStepStatus,
  KycLevel,
  KycStatus,
} from '../enums';

export class RecipientDetailsDto {
  @ApiProperty({
    description: 'Bank name',
    example: 'First National Bank',
  })
  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  account_name: string;

  @ApiProperty({
    description: 'Bank code',
    example: 'FNB001',
  })
  @IsString()
  @IsNotEmpty()
  bank_code: string;
}

export class OnrampDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Fiat amount',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  fiat_amount: number;

  @ApiProperty({
    description: 'Fiat currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  fiat_currency: FiatCurrency;

  @ApiProperty({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  crypto_currency: CryptoCurrency;

  @ApiProperty({
    description: 'Crypto network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  crypto_network: CryptoNetwork;

  @ApiProperty({
    description: 'Crypto destination address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  @IsString()
  @IsNotEmpty()
  crypto_address: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { reference: 'order_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class OfframpDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Crypto amount',
    example: '0.001',
  })
  @IsString()
  @IsNotEmpty()
  crypto_amount: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  crypto_currency: CryptoCurrency;

  @ApiProperty({
    description: 'Crypto network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  crypto_network: CryptoNetwork;

  @ApiProperty({
    description: 'Fiat currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  fiat_currency: FiatCurrency;

  @ApiProperty({
    description: 'Recipient bank details',
    type: RecipientDetailsDto,
  })
  @ValidateNested()
  @Type(() => RecipientDetailsDto)
  recipient_details: RecipientDetailsDto;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { reference: 'order_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class FiatExchangeDto {
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
    description: 'Rate ID',
    example: 'rate_123456789',
  })
  @IsString()
  @IsNotEmpty()
  rate_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Source amount',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  source_amount: number;

  @ApiProperty({
    description: 'Source currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  source_currency: FiatCurrency;

  @ApiProperty({
    description: 'Target currency',
    example: FiatCurrency.EUR,
    enum: FiatCurrency,
  })
  @IsEnum(FiatCurrency)
  target_currency: FiatCurrency;

  @ApiProperty({
    description: 'Recipient bank details',
    type: RecipientDetailsDto,
  })
  @ValidateNested()
  @Type(() => RecipientDetailsDto)
  recipient_details: RecipientDetailsDto;

  @ApiProperty({
    description: 'Purpose of transfer',
    example: 'Business payment',
  })
  @IsString()
  @IsNotEmpty()
  purpose_of_transfer: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { invoice_id: 'inv_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CryptoExchangeDto {
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
    description: 'Rate ID',
    example: 'rate_123456789',
  })
  @IsString()
  @IsNotEmpty()
  rate_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Source amount',
    example: '0.001',
  })
  @IsString()
  @IsNotEmpty()
  source_amount: string;

  @ApiProperty({
    description: 'Source currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  source_currency: CryptoCurrency;

  @ApiProperty({
    description: 'Source network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  source_network: CryptoNetwork;

  @ApiProperty({
    description: 'Target currency',
    example: CryptoCurrency.ETH,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  target_currency: CryptoCurrency;

  @ApiProperty({
    description: 'Target network',
    example: CryptoNetwork.ETHEREUM,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  target_network: CryptoNetwork;

  @ApiProperty({
    description: 'Target address',
    example: '0x742d35Cc7Bf58C94532b89B1F93C8ee3Ec3F4E4A',
  })
  @IsString()
  @IsNotEmpty()
  target_address: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { swap_id: 'swap_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class PaymentDetailsDto {
  @ApiProperty({
    description: 'Bank name',
    example: 'First National Bank',
  })
  bank_name: string;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  account_number: string;

  @ApiProperty({
    description: 'Account name',
    example: 'John Doe',
  })
  account_name: string;

  @ApiProperty({
    description: 'Payment reference',
    example: 'PAY_123456789',
  })
  reference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 100.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  currency: FiatCurrency;
}

export class CryptoDetailsDto {
  @ApiProperty({
    description: 'Crypto amount',
    example: '0.001',
  })
  amount: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  currency: CryptoCurrency;

  @ApiProperty({
    description: 'Network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  network: CryptoNetwork;

  @ApiPropertyOptional({
    description: 'Destination address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  destination_address?: string;

  @ApiPropertyOptional({
    description: 'Deposit address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'QR code for address',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qr_code?: string;

  @ApiPropertyOptional({
    description: 'Memo for transaction',
    example: 'memo_123456',
  })
  memo?: string;
}

export class UserVerificationDto {
  @ApiProperty({
    description: 'KYC level',
    example: KycLevel.LEVEL_1,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'KYC status',
    example: KycStatus.VERIFIED,
    enum: KycStatus,
  })
  kyc_status: KycStatus;

  @ApiPropertyOptional({
    description: 'Verification check timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  verification_check_time?: string;

  @ApiPropertyOptional({
    description: 'Basic verification status',
    example: true,
  })
  basic_verification?: boolean;

  @ApiPropertyOptional({
    description: 'Enhanced verification status',
    example: false,
  })
  enhanced_verification?: boolean;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction status',
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  transaction_id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'Reference code',
    example: 'REF_123456789',
  })
  reference_code: string;

  @ApiProperty({
    description: 'User verification details',
    type: UserVerificationDto,
  })
  user_verification: UserVerificationDto;

  @ApiPropertyOptional({
    description: 'Payment details',
    type: PaymentDetailsDto,
  })
  payment_details?: PaymentDetailsDto;

  @ApiPropertyOptional({
    description: 'Crypto details',
    type: CryptoDetailsDto,
  })
  crypto_details?: CryptoDetailsDto;

  @ApiPropertyOptional({
    description: 'Crypto deposit details',
    type: CryptoDetailsDto,
  })
  crypto_deposit?: CryptoDetailsDto;

  @ApiPropertyOptional({
    description: 'Fiat details',
  })
  fiat_details?: any;

  @ApiPropertyOptional({
    description: 'Source payment details',
    type: PaymentDetailsDto,
  })
  source_payment_details?: PaymentDetailsDto;

  @ApiPropertyOptional({
    description: 'Target details',
  })
  target_details?: any;

  @ApiPropertyOptional({
    description: 'Source deposit details',
    type: CryptoDetailsDto,
  })
  source_deposit?: CryptoDetailsDto;

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
    description: 'Transaction expiry timestamp',
    example: '2023-10-01T12:30:00Z',
  })
  expires_at: string;
}

export class TimelineStepDto {
  @ApiProperty({
    description: 'Timeline step name',
    example: TimelineStep.PAYMENT_RECEIVED,
    enum: TimelineStep,
  })
  step: TimelineStep;

  @ApiProperty({
    description: 'Step status',
    example: TimelineStepStatus.COMPLETED,
    enum: TimelineStepStatus,
  })
  status: TimelineStepStatus;

  @ApiProperty({
    description: 'Step timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Step duration in milliseconds',
    example: 30000,
  })
  duration_ms?: number;
}

export class TransactionDetailsDto {
  @ApiPropertyOptional({
    description: 'Fiat amount',
    example: 100.5,
  })
  fiat_amount?: number;

  @ApiPropertyOptional({
    description: 'Fiat currency',
    example: FiatCurrency.USD,
    enum: FiatCurrency,
  })
  fiat_currency?: FiatCurrency;

  @ApiPropertyOptional({
    description: 'Crypto amount',
    example: '0.001',
  })
  crypto_amount?: string;

  @ApiPropertyOptional({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  crypto_currency?: CryptoCurrency;

  @ApiPropertyOptional({
    description: 'Crypto network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  crypto_network?: CryptoNetwork;

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
}

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: 'usr_123456789',
  })
  user_id: string;

  @ApiProperty({
    description: 'KYC level',
    example: KycLevel.LEVEL_1,
    enum: KycLevel,
  })
  kyc_level: KycLevel;

  @ApiProperty({
    description: 'KYC status',
    example: KycStatus.VERIFIED,
    enum: KycStatus,
  })
  kyc_status: KycStatus;
}

export class TransactionStatusDto {
  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  gbawo_transaction_id: string;

  @ApiProperty({
    description: 'Reference code',
    example: 'REF_123456789',
  })
  reference_code: string;

  @ApiProperty({
    description: 'Transaction status',
    example: TransactionStatus.COMPLETED,
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Activity type',
    example: ActivityType.ONRAMP,
    enum: ActivityType,
  })
  activity_type: ActivityType;

  @ApiProperty({
    description: 'User information',
    type: UserInfoDto,
  })
  user_info: UserInfoDto;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: string;

  @ApiPropertyOptional({
    description: 'Completion timestamp',
    example: '2023-10-01T12:30:00Z',
  })
  completed_at?: string;

  @ApiProperty({
    description: 'Transaction details',
    type: TransactionDetailsDto,
  })
  details: TransactionDetailsDto;

  @ApiProperty({
    description: 'Transaction timeline',
    type: [TimelineStepDto],
  })
  timeline: TimelineStepDto[];
}

export class TransactionSummaryDto {
  @ApiProperty({
    description: 'Transaction description',
    example: 'Fiat to Crypto Exchange',
  })
  description: string;

  @ApiProperty({
    description: 'Amount paid by user',
    example: '1,000.00 USD',
  })
  amount_paid: string;

  @ApiProperty({
    description: 'Amount received by user',
    example: '49.75 USDT',
  })
  amount_received: string;

  @ApiProperty({
    description: 'Exchange rate used',
    example: '1 USD = 0.04975 USDT',
  })
  exchange_rate: string;

  @ApiProperty({
    description: 'Processing fee charged',
    example: '250.50 USD',
  })
  processing_fee: string;
}

export class ReceiptPartiesDto {
  @ApiProperty({
    description: 'Payer name',
    example: 'John Doe',
  })
  payer: string;

  @ApiProperty({
    description: 'Service provider name',
    example: 'Gbawo Limited',
  })
  service_provider: string;
}

export class ReceiptComplianceDto {
  @ApiProperty({
    description: 'Receipt number',
    example: 'GBW-2023-001547',
  })
  receipt_number: string;

  @ApiProperty({
    description: 'Tax reference',
    example: 'VAT-12345',
  })
  tax_reference: string;

  @ApiProperty({
    description: 'Regulatory compliance note',
    example: 'Transaction processed under FCA License #12345',
  })
  regulatory_note: string;
}

export class ReceiptDownloadLinksDto {
  @ApiProperty({
    description: 'PDF download link',
    example: '/receipts/RCP_abc123_20231001.pdf',
  })
  pdf: string;

  @ApiProperty({
    description: 'HTML download link',
    example: '/receipts/RCP_abc123_20231001.html',
  })
  html: string;
}

export class TransactionReceiptDto {
  @ApiProperty({
    description: 'Receipt ID',
    example: 'RCP_abc123_20231001',
  })
  receipt_id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_abc123',
  })
  transaction_id: string;

  @ApiProperty({
    description: 'Receipt generation date',
    example: '2023-10-01T16:30:00Z',
  })
  receipt_date: string;

  @ApiProperty({
    description: 'Transaction summary details',
    type: TransactionSummaryDto,
  })
  transaction_summary: TransactionSummaryDto;

  @ApiProperty({
    description: 'Transaction parties',
    type: ReceiptPartiesDto,
  })
  parties: ReceiptPartiesDto;

  @ApiProperty({
    description: 'Compliance information',
    type: ReceiptComplianceDto,
  })
  compliance: ReceiptComplianceDto;

  @ApiProperty({
    description: 'Download links for receipt formats',
    type: ReceiptDownloadLinksDto,
  })
  download_links: ReceiptDownloadLinksDto;
}

export class TransactionQueryDto {
  @ApiPropertyOptional({
    description: 'Integrator ID to filter by',
    example: 'int_123456789',
  })
  @IsOptional()
  @IsString()
  integrator_id?: string;

  @ApiPropertyOptional({
    description: 'User ID to filter by',
    example: 'usr_123456789',
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Transaction status to filter by',
    example: TransactionStatus.COMPLETED,
    enum: TransactionStatus,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Transaction type to filter by',
    example: ActivityType.ONRAMP,
    enum: ActivityType,
  })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiPropertyOptional({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2023-10-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2023-10-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Reference code to filter by',
    example: 'REF_123456789',
  })
  @IsOptional()
  @IsString()
  reference_code?: string;

  @ApiPropertyOptional({
    description: 'Number of records per page (1-100)',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Page number (starting from 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'created_at',
    enum: ['created_at', 'completed_at', 'amount'],
  })
  @IsOptional()
  @IsEnum(['created_at', 'completed_at', 'amount'])
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort_order?: string = 'desc';
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of records',
    example: 150,
  })
  total_records: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  total_pages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  has_next: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  has_previous: boolean;
}

export class TransactionListResponseDto {
  @ApiProperty({
    description: 'List of transactions',
    type: [TransactionStatusDto],
  })
  transactions: TransactionStatusDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;

  @ApiProperty({
    description: 'Applied filters',
    example: {
      status: 'completed',
      integrator_id: 'int_123456789',
      start_date: '2023-10-01T00:00:00Z',
      end_date: '2023-10-31T23:59:59Z',
    },
  })
  filters_applied: Record<string, any>;
}
