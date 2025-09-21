import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  AllowNull,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  ActivityType,
  TransactionStatus,
  TransactionPriority,
  FiatCurrency,
  CryptoCurrency,
  CryptoNetwork,
  CancellationReason,
} from '../common/enums';

@Table({
  tableName: 'transactions',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['integrator_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
    { fields: ['reference_code'] },
    { fields: ['activity_type'] },
    { fields: ['integrator_id', 'status'] },
  ],
})
export class Transaction extends Model<Transaction> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'gbawo_txn_* format',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References Integrator.id',
  })
  public integrator_id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References User.id',
  })
  public user_id: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'External transaction reference',
  })
  public integrator_transaction_id: string;

  @Unique
  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'Human-readable reference',
  })
  public reference_code: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(ActivityType),
    comment: 'onramp, offramp, fiat_exchange, crypto_exchange',
  })
  public activity_type: ActivityType;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(TransactionStatus),
    comment: 'pending, processing, completed, failed, etc.',
  })
  public status: TransactionStatus;

  @AllowNull(false)
  @Default(TransactionPriority.STANDARD)
  @Column({
    type: DataType.ENUM,
    values: Object.values(TransactionPriority),
    comment: 'low, standard, high',
  })
  public priority: TransactionPriority;

  // Financial amounts
  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(15, 2),
    comment: 'Fiat currency amount',
  })
  public fiat_amount: number;

  @AllowNull(true)
  @Column({
    type: DataType.ENUM,
    values: Object.values(FiatCurrency),
    comment: 'USD, EUR, GBP, CAD, AUD',
  })
  public fiat_currency: FiatCurrency;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Precise crypto amount as string',
  })
  public crypto_amount: string;

  @AllowNull(true)
  @Column({
    type: DataType.ENUM,
    values: Object.values(CryptoCurrency),
    comment: 'BTC, ETH, USDT, USDC',
  })
  public crypto_currency: CryptoCurrency;

  @AllowNull(true)
  @Column({
    type: DataType.ENUM,
    values: Object.values(CryptoNetwork),
    comment: 'bitcoin, ethereum, polygon',
  })
  public crypto_network: CryptoNetwork;

  // Pricing and fees
  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(20, 8),
    comment: 'Applied exchange rate',
  })
  public exchange_rate: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.DECIMAL(15, 2),
    comment: 'Total fees charged',
  })
  public fees: number;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Detailed fee structure',
  })
  public fee_breakdown: Record<string, any>;

  // Recipients and addresses
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Crypto wallet address',
  })
  public recipient_address: string;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
    comment: 'Bank account details for fiat',
  })
  public recipient_bank_details: Record<string, any>;

  // Status tracking
  @CreatedAt
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Transaction creation',
  })
  public created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Last status update',
  })
  public updated_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Completion timestamp',
  })
  public completed_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Expiration timestamp',
  })
  public expires_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Cancellation timestamp',
  })
  public cancelled_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.ENUM,
    values: Object.values(CancellationReason),
    comment: 'Reason for cancellation',
  })
  public cancellation_reason: CancellationReason;

  // Additional data
  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Flexible transaction data',
  })
  public metadata: Record<string, any>;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Blockchain/bank reference',
  })
  public external_transaction_id: string;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
