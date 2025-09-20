import { Module } from '@nestjs/common';
import { FiatController } from './fiat.controller';
import { FiatService } from './fiat.service';

@Module({
  controllers: [FiatController],
  providers: [FiatService],
  exports: [FiatService],
})
export class FiatModule {}
