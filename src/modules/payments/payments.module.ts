import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from '../cart/cart.module';
import { Order } from '../order/entity/order.entity';
import { PaymentsController } from './payments.controller';
import { PaymobService } from './paymob.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Order]), CartModule],
  controllers: [PaymentsController],
  providers: [PaymobService],
})
export class PaymentsModule {}
