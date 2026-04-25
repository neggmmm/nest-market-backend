import { Inject, Injectable } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart';
import { CART_REPOSITORY } from '../../domain/repositories/cart.repository';
import type { CartRepository } from '../../domain/repositories/cart.repository';

@Injectable()
export class GetCart {
  constructor(
    // Clean architecture boundary: query reads from the domain repository port.
    @Inject(CART_REPOSITORY)
    private readonly cartRepository: CartRepository,
  ) {}

  // Use case: load the current user's cart, if it exists.
  execute(userId: number): Promise<Cart | null> {
    return this.cartRepository.findByUserId(userId);
  }
}
