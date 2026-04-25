import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from '../../domain/repositories/cart.repository';
import type { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class DeleteCart {
  constructor(
    // Clean architecture boundary: whole-cart deletion goes through the cart port.
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  // Use case: clear the authenticated user's entire cart.
  execute(userId: number): Promise<void> {
    return this.cartRepository.deleteByUserId(userId);
  }
}
