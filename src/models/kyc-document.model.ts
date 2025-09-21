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
import { DocumentType, DocumentStatus, KycLevel } from '../common/enums';

@Table({
  tableName: 'kyc_documents',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['user_id', 'kyc_level'] },
  ],
})
export class KycDocument extends Model<KycDocument> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    comment: 'Unique document ID',
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
    values: Object.values(DocumentType),
    comment: 'passport, drivers_license, national_id, etc.',
  })
  public document_type: DocumentType;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(DocumentStatus),
    comment: 'pending, verified, rejected, expired',
  })
  public status: DocumentStatus;

  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM,
    values: Object.values(KycLevel),
    comment: 'Associated KYC level',
  })
  public kyc_level: KycLevel;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'Secure storage URL',
  })
  public file_url: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: 'File integrity hash',
  })
  public file_hash: string;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Provider submission data',
  })
  public submission_data: Record<string, any>;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
    comment: 'Provider response data',
  })
  public verification_result: Record<string, any>;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Verification timestamp',
  })
  public verified_at: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    comment: 'Document expiration',
  })
  public expires_at: Date;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    comment: 'Submission timestamp',
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
