import { CartItem } from './cartItems';

// Domain model: this keeps cart business data independent from TypeORM.
export class Cart {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly items: CartItem[],
  ) {}

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}
