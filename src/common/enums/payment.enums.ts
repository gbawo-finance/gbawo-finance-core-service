/**
 * Payment and banking-related enums for the Gbawo Finance Core Service
 */

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
  WIRE_TRANSFER = 'wire_transfer',
  ACH = 'ach',
}

export enum BankStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum AccountResolutionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum CryptoTransferStatus {
  PENDING = 'pending',
  WAITING = 'waiting',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}
