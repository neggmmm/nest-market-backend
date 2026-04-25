import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart';
import { CART_REPOSITORY } from '../../domain/repositories/cart.repository';
import type { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class RemoveItem {
  constructor(
    // Clean architecture boundary: ownership-safe removal is handled behind the port.
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  // Use case: remove one item from the authenticated user's cart.
  async execute(itemId: number, userId: number): Promise<Cart | null> {
    const cart = await this.cartRepository.removeItem({ itemId, userId });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    return cart;
  }
}
