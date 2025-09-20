/**
 * Webhook-related enums for the Gbawo Finance Core Service
 */

export enum WebhookEventType {
  FIAT_COLLECTION_COMPLETED = 'fiat.collection.completed',
  FIAT_DISBURSEMENT_COMPLETED = 'fiat.disbursement.completed',
  CRYPTO_TRANSFER_CONFIRMED = 'crypto.transfer.confirmed',
  CRYPTO_RECEIVE_DETECTED = 'crypto.receive.detected',
  KYC_VERIFICATION_COMPLETED = 'kyc.verification_completed',
  TRANSACTION_COMPLETED = 'transaction.completed',
  TRANSACTION_FAILED = 'transaction.failed',
  KYC_VERIFIED = 'kyc.verified',
}

export enum WebhookTestStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum WebhookDeliveryStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETRYING = 'retrying',
}
