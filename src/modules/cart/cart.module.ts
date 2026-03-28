import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product]), AuthModule],
  controllers: [CartController],
  providers: [CartService, AuthGuard],
  exports: [CartService]
})
export class CartModule {}
