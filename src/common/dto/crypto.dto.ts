import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CryptoCurrency,
  CryptoNetwork,
  TransactionPriority,
  CryptoTransferStatus,
} from '../enums';

export class CryptoTransferDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: '0.001',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  currency: CryptoCurrency;

  @ApiProperty({
    description: 'Recipient address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  @IsString()
  @IsNotEmpty()
  recipient_address: string;

  @ApiProperty({
    description: 'Network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  network: CryptoNetwork;

  @ApiProperty({
    description: 'Transaction priority',
    example: TransactionPriority.STANDARD,
    enum: TransactionPriority,
  })
  @IsEnum(TransactionPriority)
  priority: TransactionPriority;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { memo: 'Payment for services' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CryptoReceiveDto {
  @ApiProperty({
    description: 'Integrator ID',
    example: 'int_123456789',
  })
  @IsString()
  @IsNotEmpty()
  integrator_id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Expected amount',
    example: '0.001',
  })
  @IsString()
  @IsNotEmpty()
  expected_amount: string;

  @ApiProperty({
    description: 'Crypto currency',
    example: CryptoCurrency.BTC,
    enum: CryptoCurrency,
  })
  @IsEnum(CryptoCurrency)
  currency: CryptoCurrency;

  @ApiProperty({
    description: 'Network',
    example: CryptoNetwork.BITCOIN,
    enum: CryptoNetwork,
  })
  @IsEnum(CryptoNetwork)
  network: CryptoNetwork;

  @ApiProperty({
    description: 'Timeout in minutes',
    example: 30,
  })
  @IsNumber()
  @IsPositive()
  timeout_minutes: number;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { order_id: 'order_12345' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CryptoTransferResponseDto {
  @ApiProperty({
    description: 'Transfer status',
    example: CryptoTransferStatus.PENDING,
    enum: CryptoTransferStatus,
  })
  status: CryptoTransferStatus;

  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  gbawo_transaction_id: string;

  @ApiProperty({
    description: 'Blockchain transaction hash',
    example: '6f8b8e0c5f5c4a1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
  })
  tx_hash: string;

  @ApiProperty({
    description: 'Network fee paid',
    example: '0.00001',
  })
  network_fee: string;

  @ApiProperty({
    description: 'Estimated confirmations required',
    example: 6,
  })
  estimated_confirmations: number;
}

export class CryptoReceiveResponseDto {
  @ApiProperty({
    description: 'Receive status',
    example: CryptoTransferStatus.WAITING,
    enum: CryptoTransferStatus,
  })
  status: CryptoTransferStatus;

  @ApiProperty({
    description: 'Gbawo transaction ID',
    example: 'gbawo_txn_123456789',
  })
  gbawo_transaction_id: string;

  @ApiProperty({
    description: 'Deposit address',
    example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  })
  deposit_address: string;

  @ApiProperty({
    description: 'QR code for deposit address',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qr_code: string;

  @ApiProperty({
    description: 'Timeout timestamp',
    example: '2023-10-01T12:30:00Z',
  })
  timeout_at: string;
}
