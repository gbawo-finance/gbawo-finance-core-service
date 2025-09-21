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
import { TimelineStep, TimelineStepStatus } from '../common/enums';

@Table({
  tableName: 'transaction_timeline',
  timestamps: false,
  paranoid: false,
  indexes: [
    { fields: ['transaction_id'] },
    { fields: ['step'] },
    { fields: ['status'] },
  ],
})
export class TransactionTimeline extends Model<TransactionTimeline> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique timeline entry ID',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References Transaction.id',
  })
  public transaction_id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(TimelineStep),
    comment: 'transaction_created, payment_received, etc.',
  })
  public step: TimelineStep;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(TimelineStepStatus),
    comment: 'pending, in_progress, completed, failed',
  })
  public status: TimelineStepStatus;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    comment: 'Step start timestamp',
  })
  public started_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Step completion timestamp',
  })
  public completed_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
    comment: 'Step duration in milliseconds',
  })
  public duration_ms: number;

  @AllowNull(true)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Step-specific data',
  })
  public details: Record<string, any>;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    comment: 'Error details if failed',
  })
  public error_message: string;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
