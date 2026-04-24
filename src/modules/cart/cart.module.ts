import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cartItem.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { ProductOrmEntity } from '../products/infrastructure/persistence/typeorm/product.orm-entity';
import { AddCartItem } from './application/use-case/add-item.use-case';
import { CalculateTotal } from './application/use-case/calculate-total-use-case';
import { CheckItem } from './application/use-case/check-item.use-case';
import { DeleteCart } from './application/use-case/delete-cart.use-case';
import { GetCart } from './application/use-case/get-cart.use-case';
import { RemoveItem } from './application/use-case/remove-item.use-case';
import { UpdateQuantity } from './application/use-case/update-quantity.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductOrmEntity]), AuthModule],
  controllers: [CartController],
  providers: [AddCartItem, CalculateTotal, CheckItem, DeleteCart, GetCart,RemoveItem,UpdateQuantity, AuthGuard],
  exports: [GetCart, DeleteCart]
})
export class CartModule {}
