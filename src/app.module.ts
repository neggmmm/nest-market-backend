import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import * as os from 'os';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProviderApplicationsModule } from './modules/provider-applications/provider-applications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { LoggerSharedModule } from './common/logger/logger.module';
import { RedisModule } from './common/redis/redis.module';
import { AuditModule } from './modules/audit/audit.module';
import { AddressModule } from './modules/address/address.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ssl = configService.get<boolean>('database.ssl')
          ? { rejectUnauthorized: false }
          : false;

        return {
          type: 'postgres',
          // Per-worker pool — safe total = perWorker × numCPUs ≤ 100 (Postgres default limit)
          // With Redis caching most requests never touch the DB, so 8/worker is plenty.
          extra: {
            max: Math.max(5, Math.floor(80 / os.cpus().length)), // e.g. 80/12 = 6 → 6×12=72 total
            min: 2,
            idleTimeoutMillis: 30000,
          },
          url: configService.get<string>('database.url'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          ssl,
          autoLoadEntities: true,
          synchronize: true
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 6000000,
      },
      {
        name: 'long',
        ttl: 600000, // 10 minutes
        limit: 60000000,
      }
    ]),
    RedisModule,
    CommonModule,
    LoggerSharedModule,
    AuthModule,
    UsersModule,
    ProviderApplicationsModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrderModule,
    PaymentsModule,
    AuditModule,
    AddressModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
