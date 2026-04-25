import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart';
import { CART_REPOSITORY } from '../../domain/repositories/cart.repository';
import type { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class UpdateQuantity {
  constructor(
    // Clean architecture boundary: the use case updates through the repository port.
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  // Use case: set quantity for one item owned by the authenticated user.
  async execute(itemId: number, quantity: number, userId: number): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const cart = await this.cartRepository.updateItemQuantity({ itemId, quantity, userId });

    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }

    return cart;
  }
}
