/**
 * Currency and network-related enums for the Gbawo Finance Core Service
 */

export enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
}

export enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  USDC = 'USDC',
}

export enum CryptoNetwork {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
}

export enum SupportedCountry {
  US = 'US',
  UK = 'UK',
  CA = 'CA',
  EU = 'EU',
  AU = 'AU',
}

// Combined currency enum for cases where both fiat and crypto are accepted
export type Currency = FiatCurrency | CryptoCurrency;
