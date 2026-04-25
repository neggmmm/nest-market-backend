import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart';
import { CART_REPOSITORY } from '../../domain/repositories/cart.repository';
import type { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class AddCartItem {
  constructor(
    // Clean architecture boundary: the use case depends on the cart port, not TypeORM.
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  // Use case: add a product to the authenticated user's cart.
  async execute(productId: number, quantity: number, userId: number): Promise<Cart> {
    const cart = await this.cartRepository.addItem({ productId, quantity, userId });

    if (!cart) {
      throw new NotFoundException('Product not found');
    }

    return cart;
  }
}
