import { Body, Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  TransactionStatusDto,
  TransactionReceiptDto,
} from '../common/dto/transactions.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Transactions')
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: [TransactionStatusDto],
  })
  async getAllTransactions(): Promise<ApiResponseDto<TransactionStatusDto[]>> {
    const transactions = await this.transactionsService.getAllTransactions();
    return ApiResponseDto.success(
      transactions,
      'Transactions retrieved successfully',
    );
  }

  @Get('transactions/:transactionId')
  @ApiOperation({ summary: 'Get transaction status' })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID',
    example: 'txn_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction status retrieved successfully',
    type: TransactionStatusDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async getTransactionStatus(
    @Param('transactionId') transactionId: string,
  ): Promise<ApiResponseDto<TransactionStatusDto>> {
    const status =
      await this.transactionsService.getTransactionStatus(transactionId);
    return ApiResponseDto.success(
      status,
      'Transaction status retrieved successfully',
    );
  }

  @Get('transactions/:transactionId/receipt')
  @ApiOperation({ summary: 'Get transaction receipt' })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID',
    example: 'txn_abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction receipt retrieved successfully',
    type: TransactionReceiptDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - transaction not accessible',
  })
  async getTransactionReceipt(
    @Param('transactionId') transactionId: string,
  ): Promise<ApiResponseDto<TransactionReceiptDto>> {
    const receipt =
      await this.transactionsService.getTransactionReceipt(transactionId);
    return ApiResponseDto.success(
      receipt,
      'Transaction receipt retrieved successfully',
    );
  }
}
