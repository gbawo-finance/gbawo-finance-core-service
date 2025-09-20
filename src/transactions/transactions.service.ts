import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import {
  TransactionStatusDto,
  TimelineStepDto,
  TransactionDetailsDto,
  UserInfoDto,
  TransactionReceiptDto,
  TransactionSummaryDto,
  ReceiptPartiesDto,
  ReceiptComplianceDto,
  ReceiptDownloadLinksDto,
  TransactionQueryDto,
  TransactionListResponseDto,
  CancelTransactionRequestDto,
  CancelTransactionResponseDto,
  CancellationErrorDetailsDto,
} from '../common/dto/transactions.dto';
import { PaginationUtils } from '../common/dto/pagination.dto';
import {
  TransactionStatus,
  ActivityType,
  TimelineStep,
  TimelineStepStatus,
  KycLevel,
  KycStatus,
  FiatCurrency,
  CryptoCurrency,
  CryptoNetwork,
  CancellationReason,
  WebhookEventType,
} from '../common/enums';
import { WebhooksService } from '../webhooks/webhooks.service';
import { SecurityService } from '../common/security/security.service';
import { TransactionCancelledWebhookDto, TransactionCancelledDataDto } from '../common/dto/webhooks.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(WebhooksService)
    private readonly webhooksService: WebhooksService,
    private readonly securityService: SecurityService,
  ) {}
  async getAllTransactions(query?: TransactionQueryDto): Promise<TransactionListResponseDto> {
    // Generate more comprehensive mock data for demonstration
    const allMockTransactions: TransactionStatusDto[] = [
      {
        gbawo_transaction_id: 'gbawo_txn_001',
        reference_code: 'REF_001',
        status: TransactionStatus.COMPLETED,
        activity_type: ActivityType.ONRAMP,
        user_info: {
          user_id: 'usr_123456789',
          kyc_level: KycLevel.LEVEL_1,
          kyc_status: KycStatus.VERIFIED,
        },
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        details: {
          fiat_amount: 100.5,
          fiat_currency: FiatCurrency.USD,
          crypto_amount: '0.001',
          crypto_currency: CryptoCurrency.BTC,
          crypto_network: CryptoNetwork.BITCOIN,
          exchange_rate: 0.000024,
          fees: 2.5,
        },
        timeline: [
          {
            step: TimelineStep.TRANSACTION_CREATED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            duration_ms: 500,
          },
          {
            step: TimelineStep.PAYMENT_RECEIVED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            duration_ms: 30000,
          },
          {
            step: TimelineStep.CRYPTO_SENT,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            duration_ms: 60000,
          },
        ],
      },
      {
        gbawo_transaction_id: 'gbawo_txn_002',
        reference_code: 'REF_002',
        status: TransactionStatus.PROCESSING,
        activity_type: ActivityType.OFFRAMP,
        user_info: {
          user_id: 'usr_987654321',
          kyc_level: KycLevel.LEVEL_2,
          kyc_status: KycStatus.VERIFIED,
        },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: {
          crypto_amount: '0.002',
          crypto_currency: CryptoCurrency.ETH,
          crypto_network: CryptoNetwork.ETHEREUM,
          fiat_amount: 5.0,
          fiat_currency: FiatCurrency.USD,
          exchange_rate: 2500.0,
          fees: 1.5,
        },
        timeline: [
          {
            step: TimelineStep.TRANSACTION_CREATED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            duration_ms: 500,
          },
          {
            step: TimelineStep.CRYPTO_RECEIVED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            duration_ms: 300000,
          },
          {
            step: TimelineStep.PROCESSING_DISBURSEMENT,
            status: TimelineStepStatus.IN_PROGRESS,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        gbawo_transaction_id: 'gbawo_txn_003',
        reference_code: 'REF_003',
        status: TransactionStatus.PENDING,
        activity_type: ActivityType.FIAT_EXCHANGE,
        user_info: {
          user_id: 'usr_456789123',
          kyc_level: KycLevel.LEVEL_1,
          kyc_status: KycStatus.VERIFIED,
        },
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        details: {
          fiat_amount: 1000.0,
          fiat_currency: FiatCurrency.USD,
          exchange_rate: 0.85,
          fees: 5.0,
        },
        timeline: [
          {
            step: TimelineStep.TRANSACTION_CREATED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            duration_ms: 500,
          },
          {
            step: TimelineStep.WAITING_PAYMENT,
            status: TimelineStepStatus.IN_PROGRESS,
            timestamp: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
          },
        ],
      },
      {
        gbawo_transaction_id: 'gbawo_txn_004',
        reference_code: 'REF_004',
        status: TransactionStatus.FAILED,
        activity_type: ActivityType.CRYPTO_EXCHANGE,
        user_info: {
          user_id: 'usr_123456789',
          kyc_level: KycLevel.LEVEL_2,
          kyc_status: KycStatus.VERIFIED,
        },
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        details: {
          crypto_amount: '0.5',
          crypto_currency: CryptoCurrency.ETH,
          crypto_network: CryptoNetwork.ETHEREUM,
          exchange_rate: 0.5,
          fees: 10.0,
        },
        timeline: [
          {
            step: TimelineStep.TRANSACTION_CREATED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            duration_ms: 500,
          },
          {
            step: TimelineStep.PROCESSING_EXCHANGE,
            status: TimelineStepStatus.FAILED,
            timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
            duration_ms: 120000,
          },
        ],
      },
      {
        gbawo_transaction_id: 'gbawo_txn_005',
        reference_code: 'REF_005',
        status: TransactionStatus.CANCELLED,
        activity_type: ActivityType.ONRAMP,
        user_info: {
          user_id: 'usr_987654321',
          kyc_level: KycLevel.LEVEL_1,
          kyc_status: KycStatus.VERIFIED,
        },
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        details: {
          fiat_amount: 50.0,
          fiat_currency: FiatCurrency.USD,
          crypto_amount: '0.0005',
          crypto_currency: CryptoCurrency.BTC,
          crypto_network: CryptoNetwork.BITCOIN,
          exchange_rate: 0.00001,
          fees: 1.0,
        },
        timeline: [
          {
            step: TimelineStep.TRANSACTION_CREATED,
            status: TimelineStepStatus.COMPLETED,
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            duration_ms: 500,
          },
          {
            step: TimelineStep.WAITING_PAYMENT,
            status: TimelineStepStatus.FAILED,
            timestamp: new Date(Date.now() - 71 * 60 * 60 * 1000).toISOString(),
            duration_ms: 3600000,
          },
        ],
      },
    ];

    // Apply filters
    let filteredTransactions = allMockTransactions;

    if (query) {
      // Filter by integrator_id (mock: assume all transactions belong to same integrator for demo)
      if (query.integrator_id) {
        // In real implementation, filter by integrator_id
        // For demo, we'll keep all transactions
      }

      // Filter by user_id
      if (query.user_id) {
        filteredTransactions = filteredTransactions.filter(
          (tx) => tx.user_info.user_id === query.user_id,
        );
      }

      // Filter by status
      if (query.status) {
        filteredTransactions = filteredTransactions.filter(
          (tx) => tx.status === query.status,
        );
      }

      // Filter by transaction type
      if (query.type) {
        filteredTransactions = filteredTransactions.filter(
          (tx) => tx.activity_type === query.type,
        );
      }

      // Filter by reference code
      if (query.reference_code) {
        filteredTransactions = filteredTransactions.filter(
          (tx) => tx.reference_code === query.reference_code,
        );
      }

      // Filter by date range
      if (query.start_date) {
        const startDate = new Date(query.start_date);
        filteredTransactions = filteredTransactions.filter(
          (tx) => new Date(tx.created_at) >= startDate,
        );
      }

      if (query.end_date) {
        const endDate = new Date(query.end_date);
        filteredTransactions = filteredTransactions.filter(
          (tx) => new Date(tx.created_at) <= endDate,
        );
      }

      // Apply sorting
      const sortBy = query.sort_by || 'created_at';
      const sortOrder = query.sort_order || 'desc';

      filteredTransactions.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'created_at':
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
            break;
          case 'completed_at':
            aValue = a.completed_at ? new Date(a.completed_at) : new Date(0);
            bValue = b.completed_at ? new Date(b.completed_at) : new Date(0);
            break;
          case 'amount':
            aValue = a.details.fiat_amount || 0;
            bValue = b.details.fiat_amount || 0;
            break;
          default:
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    // Apply pagination
    const { page, limit } = PaginationUtils.getDefaultPaginationParams(
      query?.page,
      query?.limit,
    );
    const totalRecords = filteredTransactions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Build pagination info
    const pagination = PaginationUtils.createPaginationMeta(
      page,
      limit,
      totalRecords,
    );

    // Build filters applied object
    const filtersApplied: Record<string, any> = {};
    if (query) {
      Object.keys(query).forEach((key) => {
        const value = (query as any)[key];
        if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
          filtersApplied[key] = value;
        }
      });
    }

    // Simulate async operation
    await Promise.resolve();

    return {
      data: paginatedTransactions,
      pagination,
      filters_applied: filtersApplied,
    };
  }

  async getTransactionStatus(
    transactionId: string,
  ): Promise<TransactionStatusDto> {
    // TODO: Implement transaction status retrieval
    // This would typically involve:
    // 1. Fetch transaction from database
    // 2. Get current status and timeline
    // 3. Update status if needed (check external systems)
    // 4. Return comprehensive status

    await Promise.resolve(); // Simulate async operation
    const mockTimeline: TimelineStepDto[] = [
      {
        step: TimelineStep.TRANSACTION_CREATED,
        status: TimelineStepStatus.COMPLETED,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        duration_ms: 500,
      },
      {
        step: TimelineStep.PAYMENT_RECEIVED,
        status: TimelineStepStatus.COMPLETED,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        duration_ms: 30000,
      },
      {
        step: TimelineStep.PROCESSING_EXCHANGE,
        status: TimelineStepStatus.IN_PROGRESS,
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
    ];

    const userInfo: UserInfoDto = {
      user_id: 'usr_123456789',
      kyc_level: KycLevel.LEVEL_1,
      kyc_status: KycStatus.VERIFIED,
    };

    const details: TransactionDetailsDto = {
      fiat_amount: 100.5,
      fiat_currency: FiatCurrency.USD,
      crypto_amount: '0.001',
      crypto_currency: CryptoCurrency.BTC,
      crypto_network: CryptoNetwork.BITCOIN,
      exchange_rate: 0.000024,
      fees: 2.5,
    };

    const response: TransactionStatusDto = {
      gbawo_transaction_id: `gbawo_${transactionId}`,
      reference_code: `REF_${Date.now()}`,
      status: TransactionStatus.PROCESSING,
      activity_type: ActivityType.ONRAMP,
      user_info: userInfo,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      details: details,
      timeline: mockTimeline,
    };

    return response;
  }

  async getTransactionReceipt(
    transactionId: string,
  ): Promise<TransactionReceiptDto> {
    // TODO: Implement transaction receipt generation
    // This would typically involve:
    // 1. Fetch transaction details from database
    // 2. Get user information and compliance data
    // 3. Calculate fees and amounts for receipt
    // 4. Generate receipt number and compliance references
    // 5. Create download links for PDF/HTML formats
    // 6. Return formatted receipt

    // Generate receipt ID based on transaction ID and date
    const receiptDate = new Date();
    const receiptId = `RCP_${transactionId}_${receiptDate.toISOString().split('T')[0].replace(/-/g, '')}`;

    // Mock transaction data - in production, this would come from database
    const transactionSummary: TransactionSummaryDto = {
      description: 'Fiat to Crypto Exchange',
      amount_paid: '1,000.00 USD',
      amount_received: '49.75 USDT',
      exchange_rate: '1 USD = 0.04975 USDT',
      processing_fee: '250.50 USD',
    };

    const parties: ReceiptPartiesDto = {
      payer: 'John Doe',
      service_provider: 'Gbawo Limited',
    };

    // Generate compliance information
    const receiptNumber = `GBW-${receiptDate.getFullYear()}-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')}`;
    const compliance: ReceiptComplianceDto = {
      receipt_number: receiptNumber,
      tax_reference: 'VAT-12345',
      regulatory_note: 'Transaction processed under FCA License #12345',
    };

    const downloadLinks: ReceiptDownloadLinksDto = {
      pdf: `/receipts/${receiptId}.pdf`,
      html: `/receipts/${receiptId}.html`,
    };

    const receipt: TransactionReceiptDto = {
      receipt_id: receiptId,
      transaction_id: transactionId,
      receipt_date: receiptDate.toISOString(),
      transaction_summary: transactionSummary,
      parties: parties,
      compliance: compliance,
      download_links: downloadLinks,
    };

    // Simulate async operation
    await Promise.resolve();

    return receipt;
  }

  async cancelTransaction(
    transactionId: string,
    cancelRequest: CancelTransactionRequestDto,
  ): Promise<CancelTransactionResponseDto> {
    // Business constants for cancellation rules
    const CANCELLATION_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes
    const MAX_CANCELLATION_TIME = 30 * 60 * 1000; // 30 minutes

    // Cancellable statuses
    const CANCELLABLE_STATUSES = [
      TransactionStatus.PENDING,
      TransactionStatus.WAITING_FOR_PAYMENT,
      TransactionStatus.PENDING_PAYMENT,
      TransactionStatus.PENDING_CRYPTO_DEPOSIT,
      TransactionStatus.PENDING_SOURCE_PAYMENT,
      TransactionStatus.PENDING_SOURCE_DEPOSIT,
    ];

    // Non-cancellable statuses
    const NON_CANCELLABLE_STATUSES = [
      TransactionStatus.PROCESSING,
      TransactionStatus.COMPLETED,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELLED,
      TransactionStatus.SUSPENDED,
      TransactionStatus.EXPIRED,
    ];

    // Mock transaction data - in production, this would come from database
    const transaction = this.getMockTransaction(transactionId);
    
    // Log cancellation attempt
    this.logCancellationAttempt(transactionId, cancelRequest, 'ATTEMPT', {
      transaction_exists: !!transaction,
      current_status: transaction?.status,
    });
    
    if (!transaction) {
      this.logCancellationAttempt(transactionId, cancelRequest, 'FAILED', {
        error: 'transaction_not_found',
        reason: 'Transaction not found in system',
      });
      
      throw new NotFoundException({
        success: false,
        error: 'transaction_not_found',
        message: 'Transaction ID does not exist',
        details: {
          transaction_id: transactionId,
          reason: 'Transaction not found in system',
          alternative_actions: ['verify_transaction_id'],
        } as CancellationErrorDetailsDto,
      });
    }

    // Check if transaction is in a cancellable state
    if (!CANCELLABLE_STATUSES.includes(transaction.status)) {
      let errorCode = 'cancellation_not_allowed';
      let message = 'Transaction cannot be cancelled';
      let alternatives = ['contact_support'];

      if (transaction.status === TransactionStatus.SUSPENDED) {
        errorCode = 'admin_approval_required';
        message = 'Suspended transactions require administrative approval to cancel';
        alternatives = ['contact_support'];
      } else if (NON_CANCELLABLE_STATUSES.includes(transaction.status)) {
        message = `Transaction cannot be cancelled - ${transaction.status}`;
      }

      this.logCancellationAttempt(transactionId, cancelRequest, 'FAILED', {
        error: errorCode,
        current_status: transaction.status,
        reason: 'Transaction status not cancellable',
      });

      throw new BadRequestException({
        success: false,
        error: errorCode,
        message,
        details: {
          current_status: transaction.status,
          transaction_id: transactionId,
          reason: 'Transaction has progressed beyond cancellable state',
          alternative_actions: alternatives,
          support_reference: transaction.status === TransactionStatus.SUSPENDED ? 'SUSP-2023-001547' : undefined,
        } as CancellationErrorDetailsDto,
      });
    }

    // Check time constraints
    const transactionCreatedAt = new Date(transaction.created_at);
    const now = new Date();
    const timeSinceCreation = now.getTime() - transactionCreatedAt.getTime();

    // Always allow cancellation within grace period
    const isWithinGracePeriod = timeSinceCreation <= CANCELLATION_GRACE_PERIOD;
    
    // Disallow cancellation after maximum time
    if (timeSinceCreation > MAX_CANCELLATION_TIME && !isWithinGracePeriod) {
      throw new BadRequestException({
        success: false,
        error: 'cancellation_not_allowed',
        message: 'Transaction cannot be cancelled - maximum cancellation time exceeded',
        details: {
          current_status: transaction.status,
          transaction_id: transactionId,
          reason: 'Transaction exceeds maximum cancellation time of 30 minutes',
          alternative_actions: ['contact_support'],
        } as CancellationErrorDetailsDto,
      });
    }

    // Check for funds received (mock financial safety check)
    const hasReceivedFunds = this.checkFundsReceived(transaction);
    if (hasReceivedFunds.received) {
      this.logCancellationAttempt(transactionId, cancelRequest, 'FAILED', {
        error: 'funds_received',
        funds_received: hasReceivedFunds.amount,
        total_expected: hasReceivedFunds.total,
        reason: 'Partial funds already received',
      });

      throw new BadRequestException({
        success: false,
        error: 'funds_received',
        message: 'Cannot cancel transaction - partial payment already received',
        details: {
          current_status: transaction.status,
          transaction_id: transactionId,
          funds_received: hasReceivedFunds.amount,
          total_expected: hasReceivedFunds.total,
          reason: 'Partial funds create refund complexity',
          alternative_actions: ['contact_support', 'process_refund'],
        } as CancellationErrorDetailsDto,
      });
    }

    // Check if rate is locked (mock rate lock check)
    if (this.isRateLocked(transaction)) {
      throw new BadRequestException({
        success: false,
        error: 'rate_locked',
        message: 'Cannot cancel transaction - exchange rate is locked',
        details: {
          current_status: transaction.status,
          transaction_id: transactionId,
          reason: 'Exchange rate is locked and in use',
          alternative_actions: ['contact_support'],
        } as CancellationErrorDetailsDto,
      });
    }

    // Check if KYC/AML is completed (mock compliance check)
    if (this.isComplianceCompleted(transaction)) {
      throw new BadRequestException({
        success: false,
        error: 'compliance_completed',
        message: 'Cannot cancel transaction - KYC/AML checks are completed',
        details: {
          current_status: transaction.status,
          transaction_id: transactionId,
          reason: 'Compliance checks prevent cancellation',
          alternative_actions: ['contact_support'],
        } as CancellationErrorDetailsDto,
      });
    }

    // All validations passed - proceed with cancellation
    const cancelledAt = new Date().toISOString();
    const previousStatus = transaction.status;
    
    // Log successful cancellation
    this.logCancellationAttempt(transactionId, cancelRequest, 'SUCCESS', {
      previous_status: previousStatus,
      cancelled_at: cancelledAt,
      integrator_id: transaction.integrator_id,
      financial_impact: 'none',
    });
    
    // Create cancellation response
    const cancellationResponse: CancelTransactionResponseDto = {
      success: true,
      transaction_id: transactionId,
      previous_status: previousStatus,
      new_status: TransactionStatus.CANCELLED,
      cancelled_at: cancelledAt,
      cancellation_reason: cancelRequest.reason,
      cancellation_notes: cancelRequest.notes,
      refund_details: {
        refund_required: false,
        refund_amount: 0,
        refund_currency: undefined,
        estimated_refund_time: undefined,
      },
    };

    // TODO: In production, this would:
    // 1. Update transaction status in database
    // 2. Log audit trail
    // 3. Send webhook notification ✓ (implemented below)
    // 4. Handle any refund processing if needed
    // 5. Update related records (rates, compliance, etc.)

    // Send webhook notification
    await this.sendCancellationWebhook(
      transactionId,
      transaction.integrator_id,
      previousStatus,
      cancelRequest,
    );

    // Simulate async operation
    await Promise.resolve();

    return cancellationResponse;
  }

  private getMockTransaction(transactionId: string): any {
    // Mock transaction data - in production, this would query the database
    const mockTransactions = {
      'txn_abc123': {
        transaction_id: 'txn_abc123',
        status: TransactionStatus.PENDING_PAYMENT,
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        integrator_id: 'int_123456789',
        details: {
          fiat_amount: 1000.00,
          crypto_amount: '0.05',
          exchange_rate: 0.00005,
        },
      },
      'txn_def456': {
        transaction_id: 'txn_def456',
        status: TransactionStatus.PROCESSING,
        created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
        integrator_id: 'int_123456789',
        details: {
          fiat_amount: 500.00,
          crypto_amount: '0.025',
          exchange_rate: 0.00005,
        },
      },
      'txn_ghi789': {
        transaction_id: 'txn_ghi789',
        status: TransactionStatus.PENDING_PAYMENT,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        integrator_id: 'int_123456789',
        details: {
          fiat_amount: 1000.00,
          crypto_amount: '0.05',
          exchange_rate: 0.00005,
        },
        funds_received: 500.00, // Partial payment
      },
      'txn_susp123': {
        transaction_id: 'txn_susp123',
        status: TransactionStatus.SUSPENDED,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        integrator_id: 'int_123456789',
        details: {
          fiat_amount: 2000.00,
          crypto_amount: '0.1',
          exchange_rate: 0.00005,
        },
      },
    };

    return mockTransactions[transactionId] || null;
  }

  private checkFundsReceived(transaction: any): { received: boolean; amount?: number; total?: number } {
    // Mock financial safety check
    if (transaction.funds_received && transaction.funds_received > 0) {
      return {
        received: true,
        amount: transaction.funds_received,
        total: transaction.details.fiat_amount,
      };
    }
    return { received: false };
  }

  private isRateLocked(transaction: any): boolean {
    // Mock rate lock check - could check if exchange rate is locked for this transaction
    // For demo purposes, we'll say rates are locked if transaction is older than 25 minutes
    const transactionAge = Date.now() - new Date(transaction.created_at).getTime();
    return transactionAge > (25 * 60 * 1000); // 25 minutes
  }

  private isComplianceCompleted(transaction: any): boolean {
    // Mock compliance check - could check if KYC/AML verification is completed
    // For demo purposes, we'll say compliance is completed for amounts > 1500
    return transaction.details.fiat_amount > 1500;
  }

  private async sendCancellationWebhook(
    transactionId: string,
    integratorId: string,
    previousStatus: TransactionStatus,
    cancelRequest: CancelTransactionRequestDto,
  ): Promise<void> {
    try {
      const webhookData: TransactionCancelledDataDto = {
        previous_status: previousStatus,
        cancellation_reason: cancelRequest.reason,
        cancelled_by: 'integrator',
        refund_required: false,
        cancellation_notes: cancelRequest.notes,
      };

      const webhookPayload: TransactionCancelledWebhookDto = {
        event_type: WebhookEventType.TRANSACTION_CANCELLED,
        timestamp: new Date().toISOString(),
        transaction_id: transactionId,
        integrator_id: integratorId,
        data: webhookData,
      };

      // In a real implementation, this would be handled by the webhooks service
      // which would send the webhook to the integrator's configured endpoint
      console.log('Sending transaction cancellation webhook:', webhookPayload);
      
      // TODO: Implement actual webhook delivery
      // await this.webhooksService.sendWebhook(integratorId, webhookPayload);
      
    } catch (error) {
      // Log error but don't fail the cancellation
      console.error('Failed to send cancellation webhook:', error);
    }
  }

  private logCancellationAttempt(
    transactionId: string,
    cancelRequest: CancelTransactionRequestDto,
    result: 'ATTEMPT' | 'SUCCESS' | 'FAILED',
    additionalData: Record<string, any> = {},
  ): void {
    const logData = {
      transaction_id: transactionId,
      cancellation_reason: cancelRequest.reason,
      cancellation_notes: cancelRequest.notes,
      result,
      timestamp: new Date().toISOString(),
      ...additionalData,
    };

    let eventType: string;
    let severity: 'low' | 'medium' | 'high' | 'critical';

    switch (result) {
      case 'ATTEMPT':
        eventType = 'TRANSACTION_CANCELLATION_ATTEMPT';
        severity = 'low';
        break;
      case 'SUCCESS':
        eventType = 'TRANSACTION_CANCELLATION_SUCCESS';
        severity = 'medium';
        break;
      case 'FAILED':
        eventType = 'TRANSACTION_CANCELLATION_FAILED';
        severity = 'medium';
        break;
    }

    this.securityService.logSecurityEvent(eventType, logData, severity);
  }
}
