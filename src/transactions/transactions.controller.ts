import { Body, Controller, Get, Param, Query, Put, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  TransactionStatusDto,
  TransactionReceiptDto,
  TransactionQueryDto,
  TransactionListResponseDto,
  CancelTransactionRequestDto,
  CancelTransactionResponseDto,
  CancellationErrorResponseDto,
} from '../common/dto/transactions.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Transactions')
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('transactions')
  @ApiOperation({ 
    summary: 'Get transactions with filtering and pagination',
    description: 'Retrieve transactions with optional filtering by integrator, user, status, type, date range, and pagination support'
  })
  @ApiQuery({
    name: 'integrator_id',
    required: false,
    description: 'Filter by integrator ID',
    example: 'int_123456789',
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    description: 'Filter by user ID',
    example: 'usr_123456789',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by transaction status',
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by transaction type',
    enum: ['onramp', 'offramp', 'crypto_exchange', 'fiat_exchange'],
  })
  @ApiQuery({
    name: 'start_date',
    required: false,
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2023-10-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'end_date',
    required: false,
    description: 'End date for filtering (ISO 8601 format)',
    example: '2023-10-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'reference_code',
    required: false,
    description: 'Filter by reference code',
    example: 'REF_123456789',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page (1-100)',
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starting from 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    description: 'Field to sort by',
    enum: ['created_at', 'completed_at', 'amount'],
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: TransactionListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  async getAllTransactions(
    @Query() query: TransactionQueryDto,
  ): Promise<ApiResponseDto<TransactionListResponseDto>> {
    const result = await this.transactionsService.getAllTransactions(query);
    return ApiResponseDto.success(
      result,
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

  @Put('transactions/:transactionId/cancel')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Cancel a transaction',
    description: 'Cancel a transaction if it meets cancellation criteria. Enforces strict business rules to prevent financial loss and ensure data integrity.'
  })
  @ApiParam({
    name: 'transactionId',
    description: 'The transaction ID to cancel',
    example: 'txn_abc123',
  })
  @ApiBody({
    type: CancelTransactionRequestDto,
    description: 'Cancellation request details',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction cancelled successfully',
    type: CancelTransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Transaction cannot be cancelled',
    type: CancellationErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - integrator does not own transaction',
    type: CancellationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    type: CancellationErrorResponseDto,
  })
  async cancelTransaction(
    @Param('transactionId') transactionId: string,
    @Body() cancelRequest: CancelTransactionRequestDto,
  ): Promise<ApiResponseDto<CancelTransactionResponseDto>> {
    const result = await this.transactionsService.cancelTransaction(
      transactionId,
      cancelRequest,
    );
    return ApiResponseDto.success(
      result,
      'Transaction cancelled successfully',
    );
  }
}
