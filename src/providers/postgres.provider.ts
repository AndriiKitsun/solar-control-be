import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConfig, PostgresConfigType } from '@config/postgres.config';

@Injectable()
export class PostgresProvider implements TypeOrmOptionsFactory {
  constructor(
    @Inject(PostgresConfig.KEY)
    private readonly postgresConfig: PostgresConfigType,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, port, username, password, database } = this.postgresConfig;

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
