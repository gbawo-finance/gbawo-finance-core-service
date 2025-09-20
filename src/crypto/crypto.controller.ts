import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import {
  CryptoTransferDto,
  CryptoReceiveDto,
  CryptoTransferResponseDto,
  CryptoReceiveResponseDto,
} from '../common/dto/crypto.dto';
import {
  OnrampDto,
  OfframpDto,
  CryptoExchangeDto,
  TransactionResponseDto,
} from '../common/dto/transactions.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer crypto' })
  @ApiResponse({
    status: 201,
    description: 'Crypto transfer initiated successfully',
    type: CryptoTransferResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transfer data',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient balance or user not eligible',
  })
  async transferCrypto(
    @Body() cryptoTransferDto: CryptoTransferDto,
  ): Promise<ApiResponseDto<CryptoTransferResponseDto>> {
    const transfer = await this.cryptoService.transferCrypto(cryptoTransferDto);
    return ApiResponseDto.success(
      transfer,
      'Crypto transfer initiated successfully',
    );
  }

  @Post('receive')
  @ApiOperation({ summary: 'Set up crypto receiving' })
  @ApiResponse({
    status: 201,
    description: 'Crypto receive setup successfully',
    type: CryptoReceiveResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid receive setup data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible for crypto receiving',
  })
  async receiveCrypto(
    @Body() cryptoReceiveDto: CryptoReceiveDto,
  ): Promise<ApiResponseDto<CryptoReceiveResponseDto>> {
    const receive = await this.cryptoService.receiveCrypto(cryptoReceiveDto);
    return ApiResponseDto.success(receive, 'Crypto receive setup successfully');
  }

  @Post('onramp')
  @ApiOperation({ summary: 'Create onramp transaction' })
  @ApiResponse({
    status: 201,
    description: 'Onramp transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid onramp data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible or insufficient KYC',
  })
  async createOnramp(
    @Body() onrampDto: OnrampDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction = await this.cryptoService.createOnramp(onrampDto);
    return ApiResponseDto.success(
      transaction,
      'Onramp transaction created successfully',
    );
  }

  @Post('offramp')
  @ApiOperation({ summary: 'Create offramp transaction' })
  @ApiResponse({
    status: 201,
    description: 'Offramp transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid offramp data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible or insufficient KYC',
  })
  async createOfframp(
    @Body() offrampDto: OfframpDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction = await this.cryptoService.createOfframp(offrampDto);
    return ApiResponseDto.success(
      transaction,
      'Offramp transaction created successfully',
    );
  }

  @Post('exchange')
  @ApiOperation({ summary: 'Create crypto exchange transaction' })
  @ApiResponse({
    status: 201,
    description: 'Crypto exchange transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid crypto exchange data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible or insufficient KYC',
  })
  async createCryptoExchange(
    @Body() cryptoExchangeDto: CryptoExchangeDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction =
      await this.cryptoService.createCryptoExchange(cryptoExchangeDto);
    return ApiResponseDto.success(
      transaction,
      'Crypto exchange transaction created successfully',
    );
  }
}
