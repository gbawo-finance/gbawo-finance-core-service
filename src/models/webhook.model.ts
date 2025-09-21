import { Op } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { WebhookDeliveryStatus, WebhookEventType } from '../common/enums';

@Table({
  tableName: 'webhooks',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['integrator_id'] },
    { fields: ['delivery_status'] },
    { fields: ['event_type'] },
    {
      fields: ['next_retry_at'],
      where: { next_retry_at: { [Op.ne]: null } },
      name: 'idx_webhooks_next_retry',
    },
  ],
})
export class Webhook extends Model<Webhook> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique webhook ID',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References Integrator.id',
  })
  public integrator_id: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'References Transaction.id (optional)',
  })
  public transaction_id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(WebhookEventType),
    comment: 'Event type being notified',
  })
  public event_type: WebhookEventType;

  @AllowNull(false)
  @Column({
    type: DataType.JSON,
    comment: 'Webhook payload data',
  })
  public payload: Record<string, any>;

  @AllowNull(false)
  @Index
  @Default(WebhookDeliveryStatus.PENDING)
  @Column({
    type: DataType.ENUM,
    values: Object.values(WebhookDeliveryStatus),
    comment: 'pending, delivered, failed, retrying',
  })
  public delivery_status: WebhookDeliveryStatus;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    comment: 'Number of delivery attempts',
  })
  public delivery_attempts: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Last delivery attempt timestamp',
  })
  public last_attempt_at: Date;

  @AllowNull(true)
  @Index
  @Column({
    type: DataType.DATE,
    comment: 'Next retry scheduled time',
  })
  public next_retry_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Successful delivery timestamp',
  })
  public delivered_at: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Webhook creation timestamp',
  })
  public created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Last status update',
  })
  public updated_at: Date;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
