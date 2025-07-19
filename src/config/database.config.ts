import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) { }

  createSequelizeOptions(): SequelizeModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isDevelopment = nodeEnv === 'development';

    return {
      dialect: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      autoLoadModels: true,
      synchronize: isDevelopment,
      logging: isDevelopment ? console.log : false,
    };
  }
} 