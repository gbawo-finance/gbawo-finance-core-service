/**
 * KYC-related enums for the Gbawo Finance Core Service
 */

export enum KycLevel {
  LEVEL_0 = 'level_0',
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
}

export enum KycStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  PENDING_REVIEW = 'pending_review',
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  PROOF_OF_ADDRESS = 'proof_of_address',
  PROOF_OF_INCOME = 'proof_of_income',
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum VerificationStatus {
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  PENDING_REVIEW = 'pending_review',
}

// Legacy KYC level format (for backward compatibility)
export enum LegacyKycLevel {
  LEVEL_0 = '0',
  LEVEL_1 = '1',
  LEVEL_2 = '2',
  LEVEL_3 = '3',
}
