/**
 * Model associations configuration
 * This file defines all Sequelize model relationships to avoid circular import issues
 */

import { ApiKey } from './api-key.model';
import { ComplianceCheck } from './compliance-check.model';
import { FeeStructure } from './fee-structure.model';
import { Integrator } from './integrator.model';
import { KycDocument } from './kyc-document.model';
import { TransactionTimeline } from './transaction-timeline.model';
import { Transaction } from './transaction.model';
import { User } from './user.model';
import { WalletAccount } from './wallet-account.model';
import { Webhook } from './webhook.model';

/**
 * Initialize all model associations
 * Call this function after all models have been defined
 */
export function initializeAssociations(): void {
  // User associations
  User.belongsTo(Integrator, {
    foreignKey: 'integrator_id',
    as: 'integrator',
  });

  User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: 'transactions',
  });

  User.hasMany(KycDocument, {
    foreignKey: 'user_id',
    as: 'kyc_documents',
  });

  User.hasMany(WalletAccount, {
    foreignKey: 'user_id',
    as: 'wallet_accounts',
  });

  User.hasMany(ComplianceCheck, {
    foreignKey: 'user_id',
    as: 'compliance_checks',
  });

  // Integrator associations
  Integrator.hasMany(User, {
    foreignKey: 'integrator_id',
    as: 'users',
  });

  Integrator.hasMany(ApiKey, {
    foreignKey: 'integrator_id',
    as: 'api_keys',
  });

  Integrator.hasMany(Transaction, {
    foreignKey: 'integrator_id',
    as: 'transactions',
  });

  Integrator.hasMany(Webhook, {
    foreignKey: 'integrator_id',
    as: 'webhooks',
  });

  Integrator.hasMany(FeeStructure, {
    foreignKey: 'integrator_id',
    as: 'fee_structures',
  });

  // ApiKey associations
  ApiKey.belongsTo(Integrator, {
    foreignKey: 'integrator_id',
    as: 'integrator',
  });

  // Transaction associations
  Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  Transaction.belongsTo(Integrator, {
    foreignKey: 'integrator_id',
    as: 'integrator',
  });

  Transaction.hasMany(TransactionTimeline, {
    foreignKey: 'transaction_id',
    as: 'timeline_entries',
    onDelete: 'CASCADE',
  });

  Transaction.hasMany(Webhook, {
    foreignKey: 'transaction_id',
    as: 'webhooks',
  });

  Transaction.hasMany(ComplianceCheck, {
    foreignKey: 'transaction_id',
    as: 'compliance_checks',
  });

  // TransactionTimeline associations
  TransactionTimeline.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction',
    onDelete: 'CASCADE',
  });

  // KycDocument associations
  KycDocument.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Webhook associations
  Webhook.belongsTo(Integrator, {
    foreignKey: 'integrator_id',
    as: 'integrator',
  });

  Webhook.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction',
  });

  // WalletAccount associations
  WalletAccount.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // ComplianceCheck associations
  ComplianceCheck.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  ComplianceCheck.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction',
  });

  // FeeStructure associations
  FeeStructure.belongsTo(Integrator, {
    foreignKey: 'integrator_id',
    as: 'integrator',
  });

  // AuditLog doesn't have direct associations as it's for logging purposes
}

/**
 * Export all association definitions for reference
 */
export const ASSOCIATIONS = {
  User: {
    belongsTo: ['Integrator'],
    hasMany: ['Transaction', 'KycDocument', 'WalletAccount', 'ComplianceCheck'],
  },
  Integrator: {
    hasMany: ['User', 'ApiKey', 'Transaction', 'Webhook', 'FeeStructure'],
  },
  ApiKey: {
    belongsTo: ['Integrator'],
  },
  Transaction: {
    belongsTo: ['User', 'Integrator'],
    hasMany: ['TransactionTimeline', 'Webhook', 'ComplianceCheck'],
  },
  TransactionTimeline: {
    belongsTo: ['Transaction'],
  },
  KycDocument: {
    belongsTo: ['User'],
  },
  Webhook: {
    belongsTo: ['Integrator', 'Transaction'],
  },
  WalletAccount: {
    belongsTo: ['User'],
  },
  ComplianceCheck: {
    belongsTo: ['User', 'Transaction'],
  },
  FeeStructure: {
    belongsTo: ['Integrator'],
  },
  AuditLog: {
    // No direct associations - used for audit trail
  },
} as const;
