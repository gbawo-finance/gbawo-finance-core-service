import { Global, Module } from '@nestjs/common';
import { SecurityConfigService } from '../../config/security.config';
import { SecurityExceptionFilter } from '../filters/security-exception.filter';
import { SecurityValidationPipe } from './security-validation.pipe';
import { SecurityController } from './security.controller';
import { SecurityInterceptor } from './security.interceptor';
import { SecurityService } from './security.service';

@Global()
@Module({
  providers: [
    SecurityConfigService,
    SecurityService,
    SecurityInterceptor,
    SecurityValidationPipe,
    SecurityExceptionFilter,
  ],
  controllers: [SecurityController],
  exports: [
    SecurityConfigService,
    SecurityService,
    SecurityInterceptor,
    SecurityValidationPipe,
    SecurityExceptionFilter,
  ],
})
export class SecurityModule {}
