import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { SecurityModule } from '../common/security/security.module';

@Module({
  imports: [WebhooksModule, SecurityModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
