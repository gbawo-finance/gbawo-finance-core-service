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
  UpdatedAt,
} from 'sequelize-typescript';
import { FiatCurrency, CryptoCurrency, CryptoNetwork } from '../common/enums';

// Combined currency type
export type Currency = FiatCurrency | CryptoCurrency;

export enum WalletType {
  CRYPTO = 'crypto',
  FIAT = 'fiat',
}

export enum WalletStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FROZEN = 'frozen',
}

@Table({
  tableName: 'wallet_accounts',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['currency'] },
    { 
      fields: ['user_id', 'currency', 'network'], 
      unique: true,
      name: 'idx_wallet_accounts_user_currency'
    },
  ],
})
export class WalletAccount extends Model<WalletAccount> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique wallet ID',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References User.id',
  })
  public user_id: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(WalletType),
    comment: 'Wallet type',
  })
  public type: WalletType;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Currency (fiat or crypto)',
  })
  public currency: Currency;

  @AllowNull(true)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(CryptoNetwork),
    comment: 'Network for crypto wallets',
  })
  public network: CryptoNetwork;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Crypto address or account number',
  })
  public address: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.DECIMAL(20, 8),
    comment: 'Available balance',
  })
  public balance: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.DECIMAL(20, 8),
    comment: 'Reserved for pending transactions',
  })
  public reserved_balance: number;

  @AllowNull(false)
  @Default(WalletStatus.ACTIVE)
  @Column({
    type: DataType.ENUM,
    values: Object.values(WalletStatus),
    comment: 'Wallet status',
  })
  public status: WalletStatus;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Wallet creation timestamp',
  })
  public created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Last balance update',
  })
  public updated_at: Date;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
