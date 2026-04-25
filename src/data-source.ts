import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

const configService = new ConfigService(configuration());
const ssl = configService.get<boolean>('database.ssl')
  ? { rejectUnauthorized: false }
  : false;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get('database.url'),
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.name'),
  ssl,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
});
