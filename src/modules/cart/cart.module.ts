import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './presentation/cart.controller';
import { Cart } from './infrastructure/typeorm/cart.entity';
import { CartItem } from './infrastructure/typeorm/cartItem.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { ProductOrmEntity } from '../products/infrastructure/persistence/typeorm/product.orm-entity';
import { AddCartItem } from './application/use-case/add-item.use-case';
import { CalculateTotal } from './application/use-case/calculate-total-use-case';
import { DeleteCart } from './application/use-case/delete-cart.use-case';
import { GetCart } from './application/use-case/get-cart.use-case';
import { RemoveItem } from './application/use-case/remove-item.use-case';
import { UpdateQuantity } from './application/use-case/update-quantity.use-case';
import { CART_REPOSITORY } from './domain/repositories/cart.repository';
import { TypeormCartRepository } from './infrastructure/typeorm/typeorm-cart.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductOrmEntity]), AuthModule],
  controllers: [CartController],
  providers: [
    AddCartItem,
    CalculateTotal,
    DeleteCart,
    GetCart,
    RemoveItem,
    UpdateQuantity,
    AuthGuard,
    TypeormCartRepository,
    {
      provide: CART_REPOSITORY,
      useExisting: TypeormCartRepository,
    },
  ],
  exports: [GetCart, DeleteCart]
})
export class CartModule {}
