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

export enum ComplianceResult {
  PASS = 'pass',
  FAIL = 'fail',
  REVIEW = 'review',
}

@Table({
  tableName: 'compliance_checks',
  timestamps: false,
  paranoid: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['transaction_id'] },
    { fields: ['result'] },
    { fields: ['check_type'] },
  ],
})
export class ComplianceCheck extends Model<ComplianceCheck> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique check ID',
  })
  declare id: string;

  @Index
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'References User.id',
  })
  public user_id: string;

  @Index
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'References Transaction.id (optional)',
  })
  public transaction_id: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING,
    comment: 'aml, sanctions, pep, etc.',
  })
  public check_type: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: 'Screening service provider',
  })
  public provider: string;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(ComplianceResult),
    comment: 'Check result',
  })
  public result: ComplianceResult;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(5, 2),
    comment: 'Risk assessment score',
  })
  public risk_score: number;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Provider-specific response data',
  })
  public details: Record<string, any>;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Admin user who reviewed',
  })
  public reviewed_by: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Manual review timestamp',
  })
  public reviewed_at: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Check execution timestamp',
  })
  public created_at: Date;

  // Note: Associations will be defined in a separate associations file to avoid circular imports
}
