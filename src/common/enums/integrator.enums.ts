/**
 * Integrator-related enums for the Gbawo Finance Core Service
 */

export enum IntegratorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum IntegrationType {
  API = 'api',
  WIDGET = 'widget',
  WHITE_LABEL = 'white_label',
}

export enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum FeeType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  TIERED = 'tiered',
}
