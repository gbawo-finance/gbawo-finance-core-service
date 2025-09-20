import { Module } from '@nestjs/common';
import { IntegratorsController } from './integrators.controller';
import { IntegratorsService } from './integrators.service';

@Module({
  controllers: [IntegratorsController],
  providers: [IntegratorsService],
  exports: [IntegratorsService],
})
export class IntegratorsModule {}
