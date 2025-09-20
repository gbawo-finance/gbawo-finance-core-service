import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsUrl,
  IsArray,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IntegratorProfileDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Financial Services',
  })
  company_name: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'contact@acme.com',
  })
  contact_email: string;

  @ApiProperty({
    description: 'Account status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Allowed transaction types',
    example: ['onramp', 'offramp', 'fiat_exchange'],
    type: [String],
  })
  allowed_transaction_types: string[];

  @ApiProperty({
    description: 'Rate limits per hour',
    example: 1000,
  })
  rate_limit_per_hour: number;

  @ApiProperty({
    description: 'KYC requirements enabled',
    example: true,
  })
  kyc_required: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  updated_at: string;

  @ApiPropertyOptional({
    description: 'Additional configuration',
    example: {
      default_currency: 'USD',
      webhook_timeout: 30,
    },
  })
  settings?: Record<string, any>;
}

export class UpdateIntegratorDto {
  @ApiPropertyOptional({
    description: 'Company name',
    example: 'Acme Financial Services Ltd',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  company_name?: string;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'newcontact@acme.com',
  })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({
    description: 'Allowed transaction types',
    example: ['onramp', 'offramp'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowed_transaction_types?: string[];

  @ApiPropertyOptional({
    description: 'Rate limits per hour',
    example: 2000,
  })
  @IsOptional()
  rate_limit_per_hour?: number;

  @ApiPropertyOptional({
    description: 'KYC requirements enabled',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  kyc_required?: boolean;

  @ApiPropertyOptional({
    description: 'Additional configuration settings',
    example: {
      default_currency: 'EUR',
      webhook_timeout: 60,
    },
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;
}

export class ApiKeyDto {
  @ApiProperty({
    description: 'API key ID',
    example: 'key_987654321',
  })
  key_id: string;

  @ApiProperty({
    description: 'API key name/description',
    example: 'Production API Key',
  })
  name: string;

  @ApiProperty({
    description: 'Partial API key (masked)',
    example: 'gbawo_live_****************************abcd',
  })
  masked_key: string;

  @ApiProperty({
    description: 'Key status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Key permissions/scopes',
    example: ['transactions:read', 'transactions:write', 'rates:read'],
    type: [String],
  })
  permissions: string[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last used timestamp',
    example: '2023-12-01T15:30:00Z',
  })
  last_used_at: string;

  @ApiPropertyOptional({
    description: 'Key expiration timestamp',
    example: '2024-10-01T12:00:00Z',
  })
  expires_at?: string;
}

export class ApiKeysResponseDto {
  @ApiProperty({
    description: 'List of API keys',
    type: [ApiKeyDto],
  })
  api_keys: ApiKeyDto[];
}

export class RotateApiKeyResponseDto {
  @ApiProperty({
    description: 'New API key (only shown once)',
    example: 'gbawo_live_1234567890abcdef1234567890abcdef',
  })
  new_api_key: string;

  @ApiProperty({
    description: 'API key ID',
    example: 'key_987654321',
  })
  key_id: string;

  @ApiProperty({
    description: 'Key creation timestamp',
    example: '2023-12-01T12:00:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Warning message',
    example: 'This key will only be shown once. Please store it securely.',
  })
  warning: string;
}

export class WebhookConfigDto {
  @ApiProperty({
    description: 'Webhook endpoint URL',
    example: 'https://api.acme.com/webhooks/gbawo',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Webhook events to subscribe to',
    example: ['transaction.completed', 'transaction.failed', 'kyc.verified'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  events: string[];

  @ApiPropertyOptional({
    description: 'Webhook enabled status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Webhook secret for signature verification',
    example: 'whsec_1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  secret?: string;
}

export class WebhookResponseDto {
  @ApiProperty({
    description: 'Webhook endpoint URL',
    example: 'https://api.acme.com/webhooks/gbawo',
  })
  url: string;

  @ApiProperty({
    description: 'Subscribed events',
    example: ['transaction.completed', 'transaction.failed', 'kyc.verified'],
    type: [String],
  })
  events: string[];

  @ApiProperty({
    description: 'Webhook enabled status',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Webhook configuration created/updated timestamp',
    example: '2023-10-01T12:00:00Z',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Last successful webhook delivery',
    example: '2023-12-01T15:30:00Z',
  })
  last_success_at: string;

  @ApiPropertyOptional({
    description: 'Last failed webhook delivery',
    example: '2023-12-01T14:30:00Z',
  })
  last_failure_at?: string;

  @ApiProperty({
    description: 'Total successful deliveries',
    example: 1247,
  })
  success_count: number;

  @ApiProperty({
    description: 'Total failed deliveries',
    example: 23,
  })
  failure_count: number;
}

export class WebhookTestDto {
  @ApiPropertyOptional({
    description: 'Test event type to send',
    example: 'transaction.completed',
  })
  @IsOptional()
  @IsString()
  event_type?: string;

  @ApiPropertyOptional({
    description: 'Custom test payload',
    example: {
      test: true,
      message: 'This is a test webhook',
    },
  })
  @IsOptional()
  @IsObject()
  test_payload?: Record<string, any>;
}

export class WebhookTestResponseDto {
  @ApiProperty({
    description: 'Test delivery status',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'HTTP status code received',
    example: 200,
  })
  http_status: number;

  @ApiProperty({
    description: 'Response time in milliseconds',
    example: 250,
  })
  response_time_ms: number;

  @ApiProperty({
    description: 'Test delivery timestamp',
    example: '2023-12-01T16:30:00Z',
  })
  delivered_at: string;

  @ApiPropertyOptional({
    description: 'Error message if delivery failed',
    example: 'Connection timeout',
  })
  error_message?: string;

  @ApiPropertyOptional({
    description: 'Response body from webhook endpoint',
    example: '{"received": true}',
  })
  response_body?: string;
}

export class TransactionLimitDto {
  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  transaction_type: string;

  @ApiProperty({
    description: 'Minimum transaction amount',
    example: 10.0,
  })
  min_amount: number;

  @ApiProperty({
    description: 'Maximum transaction amount',
    example: 10000.0,
  })
  max_amount: number;

  @ApiProperty({
    description: 'Currency for the limits',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Daily limit',
    example: 50000.0,
  })
  daily_limit: number;

  @ApiProperty({
    description: 'Monthly limit',
    example: 500000.0,
  })
  monthly_limit: number;

  @ApiProperty({
    description: 'Whether limits are enabled',
    example: true,
  })
  enabled: boolean;
}

export class IntegratorLimitsResponseDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction limits by type',
    type: [TransactionLimitDto],
  })
  limits: TransactionLimitDto[];

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2023-12-01T10:30:00Z',
  })
  updated_at: string;
}

export class UpdateTransactionLimitDto {
  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  @IsString()
  @IsNotEmpty()
  transaction_type: string;

  @ApiPropertyOptional({
    description: 'Minimum transaction amount',
    example: 5.0,
  })
  @IsOptional()
  min_amount?: number;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount',
    example: 15000.0,
  })
  @IsOptional()
  max_amount?: number;

  @ApiPropertyOptional({
    description: 'Currency for the limits',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Daily limit',
    example: 75000.0,
  })
  @IsOptional()
  daily_limit?: number;

  @ApiPropertyOptional({
    description: 'Monthly limit',
    example: 750000.0,
  })
  @IsOptional()
  monthly_limit?: number;

  @ApiPropertyOptional({
    description: 'Whether limits are enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateIntegratorLimitsDto {
  @ApiProperty({
    description: 'Array of transaction limits to update',
    type: [UpdateTransactionLimitDto],
  })
  @IsArray()
  limits: UpdateTransactionLimitDto[];
}

export class AnalyticsMetricDto {
  @ApiProperty({
    description: 'Metric name',
    example: 'total_volume',
  })
  metric: string;

  @ApiProperty({
    description: 'Metric value',
    example: 1250000.5,
  })
  value: number;

  @ApiProperty({
    description: 'Currency for monetary values',
    example: 'USD',
  })
  currency?: string;

  @ApiProperty({
    description: 'Percentage change from previous period',
    example: 15.5,
  })
  change_percentage?: number;
}

export class IntegratorAnalyticsDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Analytics period',
    example: '30d',
  })
  period: string;

  @ApiProperty({
    description: 'Total transaction volume',
    example: 1250000.5,
  })
  total_volume: number;

  @ApiProperty({
    description: 'Total fees collected',
    example: 12500.75,
  })
  total_fees: number;

  @ApiProperty({
    description: 'Transaction count',
    example: 2847,
  })
  transaction_count: number;

  @ApiProperty({
    description: 'Success rate percentage',
    example: 98.5,
  })
  success_rate: number;

  @ApiProperty({
    description: 'Average transaction amount',
    example: 439.12,
  })
  average_transaction_amount: number;

  @ApiProperty({
    description: 'Top transaction types by volume',
    example: [
      { type: 'onramp', volume: 750000.25, count: 1205 },
      { type: 'offramp', volume: 500000.25, count: 1642 },
    ],
  })
  top_transaction_types: Array<{
    type: string;
    volume: number;
    count: number;
  }>;

  @ApiProperty({
    description: 'Daily breakdown',
    example: [
      { date: '2023-12-01', volume: 45000.0, transactions: 95, fees: 450.0 },
      { date: '2023-12-02', volume: 52000.0, transactions: 108, fees: 520.0 },
    ],
  })
  daily_breakdown: Array<{
    date: string;
    volume: number;
    transactions: number;
    fees: number;
  }>;

  @ApiProperty({
    description: 'Report generation timestamp',
    example: '2023-12-01T16:30:00Z',
  })
  generated_at: string;
}

export class SettlementEntryDto {
  @ApiProperty({
    description: 'Settlement entry ID',
    example: 'settle_123456789',
  })
  settlement_id: string;

  @ApiProperty({
    description: 'Settlement date',
    example: '2023-12-01',
  })
  settlement_date: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  transaction_type: string;

  @ApiProperty({
    description: 'Gross amount',
    example: 10000.0,
  })
  gross_amount: number;

  @ApiProperty({
    description: 'Platform fees',
    example: 100.0,
  })
  platform_fees: number;

  @ApiProperty({
    description: 'Network fees',
    example: 25.0,
  })
  network_fees: number;

  @ApiProperty({
    description: 'Net settlement amount',
    example: 9875.0,
  })
  net_amount: number;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Settlement status',
    example: 'completed',
  })
  status: string;
}

export class SettlementReportDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Report period start',
    example: '2023-12-01T00:00:00Z',
  })
  period_start: string;

  @ApiProperty({
    description: 'Report period end',
    example: '2023-12-31T23:59:59Z',
  })
  period_end: string;

  @ApiProperty({
    description: 'Total gross amount',
    example: 1250000.0,
  })
  total_gross_amount: number;

  @ApiProperty({
    description: 'Total platform fees',
    example: 12500.0,
  })
  total_platform_fees: number;

  @ApiProperty({
    description: 'Total network fees',
    example: 3250.0,
  })
  total_network_fees: number;

  @ApiProperty({
    description: 'Total net settlement',
    example: 1234250.0,
  })
  total_net_amount: number;

  @ApiProperty({
    description: 'Settlement entries',
    type: [SettlementEntryDto],
  })
  settlements: SettlementEntryDto[];

  @ApiProperty({
    description: 'Report generation timestamp',
    example: '2023-12-01T16:30:00Z',
  })
  generated_at: string;
}

export class ReconciliationItemDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  transaction_id: string;

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-12-01T14:30:00Z',
  })
  transaction_date: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  transaction_type: string;

  @ApiProperty({
    description: 'Expected amount',
    example: 1000.0,
  })
  expected_amount: number;

  @ApiProperty({
    description: 'Actual amount',
    example: 1000.0,
  })
  actual_amount: number;

  @ApiProperty({
    description: 'Difference amount',
    example: 0.0,
  })
  difference: number;

  @ApiProperty({
    description: 'Reconciliation status',
    example: 'matched',
  })
  status: string;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  currency: string;
}

export class ReconciliationReportDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Reconciliation period',
    example: 'daily',
  })
  period_type: string;

  @ApiProperty({
    description: 'Report date',
    example: '2023-12-01',
  })
  report_date: string;

  @ApiProperty({
    description: 'Total transactions',
    example: 1247,
  })
  total_transactions: number;

  @ApiProperty({
    description: 'Matched transactions',
    example: 1245,
  })
  matched_transactions: number;

  @ApiProperty({
    description: 'Unmatched transactions',
    example: 2,
  })
  unmatched_transactions: number;

  @ApiProperty({
    description: 'Total expected amount',
    example: 547250.75,
  })
  total_expected_amount: number;

  @ApiProperty({
    description: 'Total actual amount',
    example: 547248.25,
  })
  total_actual_amount: number;

  @ApiProperty({
    description: 'Total difference',
    example: -2.5,
  })
  total_difference: number;

  @ApiProperty({
    description: 'Reconciliation items',
    type: [ReconciliationItemDto],
  })
  items: ReconciliationItemDto[];

  @ApiProperty({
    description: 'Report generation timestamp',
    example: '2023-12-01T16:30:00Z',
  })
  generated_at: string;
}

export class FeeStructureDto {
  @ApiProperty({
    description: 'Fee type',
    example: 'percentage',
  })
  type: string;

  @ApiProperty({
    description: 'Fee value',
    example: 2.5,
  })
  value: number;

  @ApiProperty({
    description: 'Minimum fee amount',
    example: 1.0,
  })
  min_amount?: number;

  @ApiProperty({
    description: 'Maximum fee amount',
    example: 100.0,
  })
  max_amount?: number;

  @ApiProperty({
    description: 'Currency for fee amounts',
    example: 'USD',
  })
  currency: string;
}

export class RateConfigDto {
  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  transaction_type: string;

  @ApiProperty({
    description: 'Fee structure configuration',
    type: FeeStructureDto,
  })
  fee_structure: FeeStructureDto;

  @ApiProperty({
    description: 'Whether dynamic pricing is enabled',
    example: true,
  })
  dynamic_pricing: boolean;

  @ApiProperty({
    description: 'Markup percentage on base rate',
    example: 0.5,
  })
  markup_percentage: number;

  @ApiProperty({
    description: 'Whether fees are capped',
    example: true,
  })
  capped_fees: boolean;

  @ApiProperty({
    description: 'Fee configuration enabled',
    example: true,
  })
  enabled: boolean;
}

export class IntegratorRatesConfigDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Rate configurations by transaction type',
    type: [RateConfigDto],
  })
  rate_configs: RateConfigDto[];

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2023-12-01T10:30:00Z',
  })
  updated_at: string;
}

export class UpdateRateConfigDto {
  @ApiProperty({
    description: 'Transaction type',
    example: 'onramp',
  })
  @IsString()
  @IsNotEmpty()
  transaction_type: string;

  @ApiPropertyOptional({
    description: 'Fee structure configuration',
    type: FeeStructureDto,
  })
  @IsOptional()
  @IsObject()
  fee_structure?: FeeStructureDto;

  @ApiPropertyOptional({
    description: 'Whether dynamic pricing is enabled',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  dynamic_pricing?: boolean;

  @ApiPropertyOptional({
    description: 'Markup percentage on base rate',
    example: 1.0,
  })
  @IsOptional()
  markup_percentage?: number;

  @ApiPropertyOptional({
    description: 'Whether fees are capped',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  capped_fees?: boolean;

  @ApiPropertyOptional({
    description: 'Fee configuration enabled',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateIntegratorRatesConfigDto {
  @ApiProperty({
    description: 'Array of rate configurations to update',
    type: [UpdateRateConfigDto],
  })
  @IsArray()
  rate_configs: UpdateRateConfigDto[];
}

export class IntegratorSummaryDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  integrator_id: string;

  @ApiProperty({
    description: 'Integrator name',
    example: 'Acme Financial Services',
  })
  name: string;

  @ApiProperty({
    description: 'Integrator status',
    example: 'active',
    enum: ['active', 'inactive', 'suspended', 'pending'],
  })
  status: string;

  @ApiProperty({
    description: 'Integration type',
    example: 'api',
    enum: ['api', 'widget', 'white_label'],
  })
  integration_type: string;

  @ApiProperty({
    description: 'Supported countries',
    example: ['US', 'UK', 'CA'],
  })
  supported_countries: string[];

  @ApiProperty({
    description: 'Supported currencies',
    example: ['USD', 'GBP', 'CAD', 'BTC', 'ETH'],
  })
  supported_currencies: string[];

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Last activity timestamp',
    example: '2023-12-01T14:20:00Z',
  })
  last_activity: string;

  @ApiProperty({
    description: 'Transaction volume (30 days)',
    example: 125000.5,
  })
  monthly_volume: number;

  @ApiProperty({
    description: 'Transaction count (30 days)',
    example: 1247,
  })
  monthly_transactions: number;
}

export class IntegratorsListResponseDto {
  @ApiProperty({
    description: 'List of integrators',
    type: [IntegratorSummaryDto],
  })
  integrators: IntegratorSummaryDto[];

  @ApiProperty({
    description: 'Total number of integrators',
    example: 25,
  })
  total_count: number;

  @ApiProperty({
    description: 'Number of active integrators',
    example: 22,
  })
  active_count: number;

  @ApiProperty({
    description: 'Pagination information',
    example: {
      page: 1,
      limit: 20,
      total_pages: 2,
      has_next: true,
      has_previous: false,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}
