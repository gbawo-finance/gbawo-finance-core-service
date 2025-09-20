import { Injectable } from '@nestjs/common';
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
} from '../common/enums';

@Injectable()
export class TransactionsService {
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
}
