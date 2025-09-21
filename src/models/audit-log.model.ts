import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Index,
  AllowNull,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

export enum ActorType {
  USER = 'user',
  INTEGRATOR = 'integrator',
  SYSTEM = 'system',
  ADMIN = 'admin',
}

@Table({
  tableName: 'audit_logs',
  timestamps: false,
  paranoid: false,
  indexes: [
    { fields: ['entity_type', 'entity_id'] },
    { fields: ['actor_type', 'actor_id'] },
    { fields: ['created_at'] },
    { fields: ['action'] },
  ],
})
export class AuditLog extends Model<AuditLog> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique log entry ID',
  })
  declare id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Type of entity (user, transaction, etc.)',
  })
  public entity_type: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'ID of the affected entity',
  })
  public entity_id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'Action performed (created, updated, deleted)',
  })
  public action: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(ActorType),
    comment: 'Who performed the action',
  })
  public actor_type: ActorType;

  @AllowNull(true)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'ID of the actor',
  })
  public actor_id: string;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Before/after data changes',
  })
  public changes: Record<string, any>;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Client IP address',
  })
  public ip_address: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    comment: 'Client user agent',
  })
  public user_agent: string;

  @CreatedAt
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Action timestamp',
  })
  public created_at: Date;
}
