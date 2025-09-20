/**
 * Transaction-related enums for the Gbawo Finance Core Service
 */

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  PENDING_PAYMENT = 'pending_payment',
  PENDING_CRYPTO_DEPOSIT = 'pending_crypto_deposit',
  PENDING_SOURCE_PAYMENT = 'pending_source_payment',
  PENDING_SOURCE_DEPOSIT = 'pending_source_deposit',
}

export enum ActivityType {
  ONRAMP = 'onramp',
  OFFRAMP = 'offramp',
  FIAT_EXCHANGE = 'fiat_exchange',
  CRYPTO_EXCHANGE = 'crypto_exchange',
}

export enum TimelineStep {
  TRANSACTION_CREATED = 'transaction_created',
  PAYMENT_RECEIVED = 'payment_received',
  CRYPTO_SENT = 'crypto_sent',
  CRYPTO_RECEIVED = 'crypto_received',
  PROCESSING_EXCHANGE = 'processing_exchange',
  PROCESSING_DISBURSEMENT = 'processing_disbursement',
  WAITING_PAYMENT = 'waiting_payment',
  IN_PROGRESS = 'in_progress',
}

export enum TimelineStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionPriority {
  LOW = 'low',
  STANDARD = 'standard',
  HIGH = 'high',
}

export enum ReconciliationStatus {
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
  PENDING = 'pending',
}
