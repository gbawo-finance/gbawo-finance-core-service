import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isDevelopment = nodeEnv === 'development';
    const modelImport = require('../models');
    const models = Object.values(modelImport) as ModelCtor[];

    return {
      dialect: this.configService.get<string>(
        'DB_DIALECT',
        'postgres',
      ) as Dialect,
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      autoLoadModels: true,
      models,
      synchronize: isDevelopment,
      logging: false,
    };
  }
}
