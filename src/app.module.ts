import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './common/security/security.module';
import { DatabaseConfigService } from './config/database.config';
import { validateEnvironment } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { RatesModule } from './rates/rates.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FiatModule } from './fiat/fiat.module';
import { CryptoModule } from './crypto/crypto.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { IntegratorsModule } from './integrators/integrators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      expandVariables: true,
      validate: validateEnvironment,
    }),
    SequelizeModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    HealthModule,
    SecurityModule,
    UsersModule,
    RatesModule,
    TransactionsModule,
    FiatModule,
    CryptoModule,
    WebhooksModule,
    IntegratorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
