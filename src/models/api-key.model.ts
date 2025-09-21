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
import { ApiKeyStatus } from '../common/enums';

@Table({
  tableName: 'api_keys',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['integrator_id'] },
    { fields: ['status'] },
    { fields: ['key_hash'] },
  ],
})
export class ApiKey extends Model<ApiKey> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique key identifier',
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
    type: DataType.STRING,
    comment: 'Hashed API key',
  })
  public key_hash: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(ApiKeyStatus),
    comment: 'active, inactive, expired, revoked',
  })
  public status: ApiKeyStatus;

  @AllowNull(false)
  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    comment: 'Permission scopes',
  })
  public scopes: string[];

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Optional expiration date',
  })
  public expires_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Last usage timestamp',
  })
  public last_used_at: Date;

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
