import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Index,
  AllowNull,
  Default,
  CreatedAt,
} from 'sequelize-typescript';
import { ActivityType, FiatCurrency, CryptoCurrency } from '../common/enums';

// Combined currency type
export type Currency = FiatCurrency | CryptoCurrency;

export enum FeeType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  TIERED = 'tiered',
}

@Table({
  tableName: 'fee_structures',
  timestamps: false,
  paranoid: false,
  indexes: [
    { fields: ['integrator_id'] },
    { fields: ['activity_type'] },
    { fields: ['effective_from', 'effective_until'] },
  ],
})
export class FeeStructure extends Model<FeeStructure> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique fee structure ID',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References Integrator.id',
  })
  public integrator_id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(ActivityType),
    comment: 'Transaction type this applies to',
  })
  public activity_type: ActivityType;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(FeeType),
    comment: 'percentage, flat, tiered',
  })
  public fee_type: FeeType;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Source currency (optional)',
  })
  public from_currency: Currency;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Target currency (optional)',
  })
  public to_currency: Currency;

  // Fee calculation parameters
  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(5, 4),
    comment: 'Percentage-based fee',
  })
  public percentage_fee: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(15, 2),
    comment: 'Fixed fee amount',
  })
  public flat_fee: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(15, 2),
    comment: 'Minimum fee threshold',
  })
  public min_fee: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(15, 2),
    comment: 'Maximum fee cap',
  })
  public max_fee: number;

  // Tiered fee structure
  @AllowNull(true)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Amount thresholds for tiers',
  })
  public tier_breakpoints: Record<string, any>;

  @AllowNull(true)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Corresponding fees per tier',
  })
  public tier_fees: Record<string, any>;

  // Validity period
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Fee structure effective date',
  })
  public effective_from: Date;

  @AllowNull(true)
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Fee structure end date',
  })
  public effective_until: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Creation timestamp',
  })
  public created_at: Date;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
