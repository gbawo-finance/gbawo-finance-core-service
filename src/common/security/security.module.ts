import { Module, Global } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { SecurityInterceptor } from './security.interceptor';
import { SecurityValidationPipe } from './security-validation.pipe';
import { SecurityExceptionFilter } from '../filters/security-exception.filter';
import { SecurityConfigService } from '../../config/security.config';

@Global()
@Module({
  providers: [
    SecurityConfigService,
    SecurityService, 
    SecurityInterceptor, 
    SecurityValidationPipe,
    SecurityExceptionFilter
  ],
  controllers: [SecurityController],
  exports: [
    SecurityConfigService,
    SecurityService, 
    SecurityInterceptor, 
    SecurityValidationPipe,
    SecurityExceptionFilter
  ],
})
export class SecurityModule {} 