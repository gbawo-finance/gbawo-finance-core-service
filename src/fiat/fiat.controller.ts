import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FiatService } from './fiat.service';
import {
  ListBanksQueryDto,
  ListBanksResponseDto,
  ResolveAccountDto,
  ResolveAccountResponseDto,
  FiatCollectDto,
  FiatCollectResponseDto,
  FiatDisburseDto,
  FiatDisburseResponseDto,
} from '../common/dto/fiat.dto';
import {
  FiatExchangeDto,
  TransactionResponseDto,
} from '../common/dto/transactions.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Fiat')
@Controller('fiat')
export class FiatController {
  constructor(private readonly fiatService: FiatService) {}

  @Get('banks')
  @ApiOperation({ summary: 'List supported banks' })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Country code to filter banks',
    example: 'US',
  })
  @ApiResponse({
    status: 200,
    description: 'Banks retrieved successfully',
    type: ListBanksResponseDto,
  })
  async listBanks(
    @Query() query: ListBanksQueryDto,
  ): Promise<ApiResponseDto<ListBanksResponseDto>> {
    const banks = await this.fiatService.listBanks(query);
    return ApiResponseDto.success(banks, 'Banks retrieved successfully');
  }

  @Get('banks/resolve-account')
  @ApiOperation({ summary: 'Resolve account name' })
  @ApiResponse({
    status: 200,
    description: 'Account resolved successfully',
    type: ResolveAccountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid account resolution data',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async resolveAccount(
    @Query() resolveAccountDto: ResolveAccountDto,
  ): Promise<ApiResponseDto<ResolveAccountResponseDto>> {
    const result = await this.fiatService.resolveAccount(resolveAccountDto);

    if (result.verified) {
      return ApiResponseDto.success(result, 'Account resolved successfully');
    } else {
      return ApiResponseDto.error('Account resolution failed', result);
    }
  }

  @Post('collect')
  @ApiOperation({ summary: 'Collect fiat payments' })
  @ApiResponse({
    status: 201,
    description: 'Fiat collection setup successfully',
    type: FiatCollectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid collection data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible for collection',
  })
  async collectFiat(
    @Body() fiatCollectDto: FiatCollectDto,
  ): Promise<ApiResponseDto<FiatCollectResponseDto>> {
    const collection = await this.fiatService.collectFiat(fiatCollectDto);
    return ApiResponseDto.success(
      collection,
      'Fiat collection setup successfully',
    );
  }

  @Post('disburse')
  @ApiOperation({ summary: 'Disburse fiat payments' })
  @ApiResponse({
    status: 201,
    description: 'Fiat disbursement initiated successfully',
    type: FiatDisburseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid disbursement data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible for disbursement',
  })
  async disburseFiat(
    @Body() fiatDisburseDto: FiatDisburseDto,
  ): Promise<ApiResponseDto<FiatDisburseResponseDto>> {
    const disbursement = await this.fiatService.disburseFiat(fiatDisburseDto);
    return ApiResponseDto.success(
      disbursement,
      'Fiat disbursement initiated successfully',
    );
  }

  @Post('exchange')
  @ApiOperation({ summary: 'Create fiat exchange transaction' })
  @ApiResponse({
    status: 201,
    description: 'Fiat exchange transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid fiat exchange data',
  })
  @ApiResponse({
    status: 403,
    description: 'User not eligible or insufficient KYC',
  })
  async createFiatExchange(
    @Body() fiatExchangeDto: FiatExchangeDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction =
      await this.fiatService.createFiatExchange(fiatExchangeDto);
    return ApiResponseDto.success(
      transaction,
      'Fiat exchange transaction created successfully',
    );
  }
}
