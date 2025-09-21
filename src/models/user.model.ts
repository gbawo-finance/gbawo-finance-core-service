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
import { SupportedCountry, UserAccountStatus, KycLevel, KycStatus } from '../common/enums';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['integrator_id'] },
    { fields: ['email'] },
    { fields: ['account_status'] },
    { fields: ['kyc_level'] },
  ],
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'usr_* format',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References Integrator.id',
  })
  public integrator_id: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'User email address',
  })
  public email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'Phone number with country code',
  })
  public phone: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'User\'s first name',
  })
  public first_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'User\'s last name',
  })
  public last_name: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Optional date of birth',
  })
  public date_of_birth: Date;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(SupportedCountry),
    comment: 'User\'s country of residence',
  })
  public country: SupportedCountry;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserAccountStatus),
    comment: 'active, inactive, suspended',
  })
  public account_status: UserAccountStatus;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(KycLevel),
    comment: 'level_0, level_1, level_2, level_3',
  })
  public kyc_level: KycLevel;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(KycStatus),
    comment: 'pending, verified, rejected, expired',
  })
  public kyc_status: KycStatus;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'Email verification status',
  })
  public email_verified: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'Phone verification status',
  })
  public phone_verified: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'Identity document verification',
  })
  public identity_verified: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'Address verification status',
  })
  public address_verified: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Account creation timestamp',
  })
  public created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Last update timestamp',
  })
  public updated_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Last login timestamp',
  })
  public last_login_at: Date;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Extensible user data',
  })
  public metadata: Record<string, any>;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
