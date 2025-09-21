import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  Index,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { IntegratorStatus, IntegrationType } from '../common/enums';

@Table({
  tableName: 'integrators',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['status'] },
    { fields: ['company_name'] },
  ],
})
export class Integrator extends Model<Integrator> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'int_* format',
  })
  declare id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Company/organization name',
  })
  public company_name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'Primary contact email',
  })
  public contact_email: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(IntegratorStatus),
    comment: 'active, inactive, suspended, pending',
  })
  public status: IntegratorStatus;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(IntegrationType),
    comment: 'api, widget, white_label',
  })
  public integration_type: IntegrationType;

  @AllowNull(false)
  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    comment: 'onramp, offramp, fiat_exchange, crypto_exchange',
  })
  public allowed_transaction_types: string[];

  @AllowNull(false)
  @Default(1000)
  @Column({
    type: DataType.INTEGER,
    comment: 'API rate limiting',
  })
  public rate_limit_per_hour: number;

  @AllowNull(false)
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    comment: 'KYC enforcement flag',
  })
  public kyc_required: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Webhook endpoint URL',
  })
  public webhook_url: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Webhook signing secret',
  })
  public webhook_secret: string;

  @AllowNull(false)
  @Default('v1')
  @Column({
    type: DataType.STRING,
    comment: 'Supported API version',
  })
  public api_version: string;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Configuration settings',
  })
  public settings: Record<string, any>;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Creation timestamp',
  })
  public created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Last update timestamp',
  })
  public updated_at: Date;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
