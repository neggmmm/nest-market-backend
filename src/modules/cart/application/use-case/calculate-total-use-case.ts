import { Injectable } from '@nestjs/common';
import { Cart } from '../../domain/entities/cart';

@Injectable()
export class CalculateTotal {
  // Kept as a use case for compatibility, but delegates to the domain cart total.
  execute(cart?: Cart | null): number {
    return cart?.totalPrice ?? 0;
  }
}
