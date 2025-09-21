import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Index,
  AllowNull,
  CreatedAt,
} from 'sequelize-typescript';
import { FiatCurrency, CryptoCurrency } from '../common/enums';

// Combined currency type
export type Currency = FiatCurrency | CryptoCurrency;

@Table({
  tableName: 'exchange_rates',
  timestamps: false,
  paranoid: false,
  indexes: [
    { 
      fields: ['from_currency', 'to_currency', 'valid_from'], 
      unique: true,
      name: 'idx_exchange_rates_unique'
    },
    { fields: ['from_currency', 'to_currency'] },
    { fields: ['valid_from', 'valid_until'] },
  ],
})
export class ExchangeRate extends Model<ExchangeRate> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique rate ID',
  })
  declare id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Source currency (fiat or crypto)',
  })
  public from_currency: Currency;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Target currency (fiat or crypto)',
  })
  public to_currency: Currency;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(20, 8),
    comment: 'Exchange rate value',
  })
  public rate: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'Rate data source',
  })
  public provider: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Rate validity start',
  })
  public valid_from: Date;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Rate validity end',
  })
  public valid_until: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Rate creation timestamp',
  })
  public created_at: Date;
}
